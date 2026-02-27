#!/usr/bin/env node
/**
 * 批量发布七个主题的大数据开发岗位JD小红书笔记
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

// 笔记描述
const desc = "实时大数据开发工程师岗位招聘！\n\n📋 职位描述：\n1. 深入理解流式SQL原理及应用场景\n2. 负责流式SQL查询优化、运行时优化\n3. 负责流计算引擎Flink的调度优化\n4. 负责实时计算在业务上的应用\n5. 负责业务线实时数仓的规划、设计以及建设\n\n🎯 职位要求：\n1. 本科及以上学历，3年及以上大数据相关开发经验\n2. 熟悉大数据实时计算生态体系\n3. 有Flink，数据库，SQL查询优化经验者优先\n4. 优秀的业务理解能力、逻辑性和沟通能力\n\n📍 工作地点：北京市朝阳区\n📞 联系方式：15072120043\n\n#大数据开发 #实时计算 #Flink #SQL优化 #数据工程师 #招聘 #北京工作";

// 批量发布
for (const theme of themes) {
    console.log(`\n=== 发布主题: ${theme} ===`);
    
    // 构建图片路径
    const themeDir = `bigdata_output_${theme}`;
    const coverPath = path.join(themeDir, 'cover.png');
    
    // 获取所有卡片图片
    const cardFiles = [];
    for (let i = 1; i <= 4; i++) {
        const cardPath = path.join(themeDir, `card_${i}.png`);
        if (fs.existsSync(cardPath)) {
            cardFiles.push(cardPath);
        }
    }
    
    // 构建图片列表
    const images = [coverPath, ...cardFiles];
    
    // 构建发布命令
    const imageArgs = images.map(img => `"${img}"`).join(' ');
    const publishCmd = `python scripts/publish_xhs.py --title "实时大数据开发工程师" --desc "${desc}" --images ${imageArgs}`;
    
    try {
        console.log(`🚀 执行发布命令: ${publishCmd}`);
        const output = execSync(publishCmd, { encoding: 'utf-8' });
        console.log(output);
        console.log(`✅ 主题 ${theme} 发布完成`);
    } catch (error) {
        console.error(`❌ 发布主题 ${theme} 失败:`, error.message);
    }
    
    // 避免频繁发布被限制，添加延迟
    if (theme !== themes[themes.length - 1]) {  // 不是最后一个主题
        console.log("\n⏰ 等待 30 秒后发布下一个主题...");
        // 延迟30秒
        const start = Date.now();
        while (Date.now() - start < 30000) {
            // 空循环
        }
    }
}

console.log('\n✨ 所有主题发布完成！');
