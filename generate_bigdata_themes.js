#!/usr/bin/env node
/**
 * 批量生成八个主题的大数据开发岗位JD小红书笔记
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 定义支持的主题
const themes = [
    'purple',
    'xiaohongshu',
    'mint',
    'sunset',
    'ocean',
    'elegant',
    'dark'
];

// 源Markdown文件
const markdownFile = 'bigdata_jd.md';

// 批量生成
for (const theme of themes) {
    console.log(`\n=== 生成主题: ${theme} ===`);
    
    // 创建主题目录
    const themeDir = `bigdata_output_${theme}`;
    if (!fs.existsSync(themeDir)) {
        fs.mkdirSync(themeDir, { recursive: true });
    }
    
    // 运行渲染脚本
    try {
        const renderCmd = `node scripts/render_xhs_v2.js "${markdownFile}" --output-dir "${themeDir}" --style "${theme}"`;
        console.log(`🚀 执行渲染命令: ${renderCmd}`);
        const output = execSync(renderCmd, { encoding: 'utf-8' });
        console.log(output);
        console.log(`✅ 主题 ${theme} 生成完成，图片保存在 ${themeDir} 目录`);
    } catch (error) {
        console.error(`❌ 生成主题 ${theme} 失败:`, error.message);
    }
}

console.log('\n✨ 所有主题生成完成！');
