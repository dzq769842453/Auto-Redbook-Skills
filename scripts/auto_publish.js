#!/usr/bin/env node
/**
 * 小红书笔记自动发布脚本
 * 用于OpenClaw自动发布小红书笔记
 * 
 * 功能：
 * 1. 渲染Markdown文件为小红书风格图片
 * 2. 发布图片到小红书
 * 3. 支持OpenClaw自动调用
 * 
 * 使用方法：
 *   node scripts/auto_publish.js <markdown_file> [options]
 * 
 * 示例：
 *   node scripts/auto_publish.js content.md --style purple --title "我的笔记"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取脚本所在目录
const SCRIPT_DIR = path.dirname(__dirname);

/**
 * 解析命令行参数
 */
function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help')) {
        console.log(`
使用方法: node scripts/auto_publish.js <markdown_file> [options]

选项:
  -o, --output-dir <dir>   输出目录（默认为当前工作目录）
  -s, --style <style>      样式主题（默认: purple）
  -t, --title <title>      笔记标题（默认从Markdown文件中提取）
  -d, --desc <desc>        笔记描述（默认从Markdown文件中提取）
  --help                  显示帮助信息

可用样式:
  purple, xiaohongshu, mint, sunset, ocean, elegant, dark

示例:
  node scripts/auto_publish.js note.md
  node scripts/auto_publish.js note.md --style xiaohongshu --title "我的笔记"
        `);
        process.exit(0);
    }
    
    let markdownFile = null;
    let outputDir = process.cwd();
    let style = 'purple';
    let title = null;
    let desc = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--output-dir' || args[i] === '-o') {
            outputDir = args[i + 1];
            i++;
        } else if (args[i] === '--style' || args[i] === '-s') {
            style = args[i + 1];
            i++;
        } else if (args[i] === '--title' || args[i] === '-t') {
            title = args[i + 1];
            i++;
        } else if (args[i] === '--desc' || args[i] === '-d') {
            desc = args[i + 1];
            i++;
        } else if (!args[i].startsWith('-')) {
            markdownFile = args[i];
        }
    }
    
    if (!markdownFile) {
        console.error('❌ 错误: 请指定 Markdown 文件');
        process.exit(1);
    }
    
    if (!fs.existsSync(markdownFile)) {
        console.error(`❌ 错误: 文件不存在 - ${markdownFile}`);
        process.exit(1);
    }
    
    return { markdownFile, outputDir, style, title, desc };
}

/**
 * 解析Markdown文件，提取标题和描述
 */
function parseMarkdownMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const yamlPattern = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const yamlMatch = content.match(yamlPattern);
    
    let metadata = {};
    let body = content;
    
    if (yamlMatch) {
        try {
            const yaml = require('js-yaml');
            metadata = yaml.load(yamlMatch[1]) || {};
        } catch (e) {
            metadata = {};
        }
        body = content.slice(yamlMatch[0].length);
    }
    
    return { metadata, body: body.trim() };
}

/**
 * 渲染Markdown文件为图片
 */
function renderMarkdown(markdownFile, outputDir, style) {
    console.log(`🎨 开始渲染: ${markdownFile}`);
    console.log(`🎨 使用样式: ${style}`);
    
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 运行渲染脚本
    try {
        const renderCmd = `node scripts/render_xhs_v2.js "${markdownFile}" --output-dir "${outputDir}" --style "${style}"`;
        console.log(`🚀 执行渲染命令: ${renderCmd}`);
        const output = execSync(renderCmd, { encoding: 'utf-8' });
        console.log(output);
        return true;
    } catch (error) {
        console.error('❌ 渲染失败:', error.message);
        return false;
    }
}

/**
 * 收集生成的图片
 */
function collectImages(outputDir) {
    const images = [];
    
    // 收集封面
    const coverPath = path.join(outputDir, 'cover.png');
    if (fs.existsSync(coverPath)) {
        images.push(coverPath);
    }
    
    // 收集卡片
    let pageNum = 1;
    while (true) {
        const cardPath = path.join(outputDir, `card_${pageNum}.png`);
        if (fs.existsSync(cardPath)) {
            images.push(cardPath);
            pageNum++;
        } else {
            break;
        }
    }
    
    if (images.length === 0) {
        console.error('❌ 错误: 未找到生成的图片');
        return null;
    }
    
    console.log(`📷 收集到 ${images.length} 张图片`);
    return images;
}

/**
 * 发布图片到小红书
 */
function publishToXiaohongshu(title, desc, images) {
    console.log(`\n🚀 准备发布到小红书`);
    console.log(`  📌 标题: ${title}`);
    console.log(`  📝 描述: ${desc.slice(0, 50)}${desc.length > 50 ? '...' : ''}`);
    console.log(`  🖼️ 图片数量: ${images.length}`);
    
    // 构建发布命令
    const imageArgs = images.map(img => `"${img}"`).join(' ');
    const publishCmd = `python scripts/publish_xhs.py --title "${title}" --desc "${desc}" --images ${imageArgs}`;
    
    try {
        console.log(`🚀 执行发布命令: ${publishCmd}`);
        const output = execSync(publishCmd, { encoding: 'utf-8' });
        console.log(output);
        return true;
    } catch (error) {
        console.error('❌ 发布失败:', error.message);
        return false;
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('📝 小红书笔记自动发布脚本');
    console.log('='.repeat(50));
    
    // 解析参数
    const { markdownFile, outputDir, style, title: argTitle, desc: argDesc } = parseArgs();
    
    // 解析Markdown元数据
    const { metadata, body } = parseMarkdownMetadata(markdownFile);
    
    // 确定标题和描述
    const title = argTitle || metadata.title || '小红书笔记';
    const desc = argDesc || metadata.desc || body.slice(0, 200) + (body.length > 200 ? '...' : '');
    
    // 渲染Markdown
    const renderSuccess = renderMarkdown(markdownFile, outputDir, style);
    if (!renderSuccess) {
        process.exit(1);
    }
    
    // 收集图片
    const images = collectImages(outputDir);
    if (!images) {
        process.exit(1);
    }
    
    // 发布到小红书
    const publishSuccess = publishToXiaohongshu(title, desc, images);
    if (!publishSuccess) {
        process.exit(1);
    }
    
    console.log('\n✨ 自动发布完成！');
}

// 运行主函数
main().catch(error => {
    console.error('❌ 自动发布失败:', error.message);
    process.exit(1);
});