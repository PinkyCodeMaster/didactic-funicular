#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getLocalIP() {
    try {
        // Try to get IP address using hostname command
        const ip = execSync('hostname -I | awk \'{print $1}\'', { encoding: 'utf8' }).trim();
        if (ip && ip.match(/^\d+\.\d+\.\d+\.\d+$/)) {
            return ip;
        }
    } catch (error) {
        // Fallback: try to get IP from network interfaces
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    return net.address;
                }
            }
        }
    }

    return null;
}

function updateConfigFile(newIP) {
    const configPath = path.join(__dirname, '..', 'lib', 'config.ts');

    if (!fs.existsSync(configPath)) {
        console.error('❌ Config file not found:', configPath);
        return false;
    }

    let content = fs.readFileSync(configPath, 'utf8');

    // Update the DEV_API_URL
    const oldPattern = /const DEV_API_URL = 'http:\/\/[\d.]+:9000';/;
    const newLine = `const DEV_API_URL = 'http://${newIP}:9000';`;

    if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newLine);
        fs.writeFileSync(configPath, content);
        return true;
    } else {
        console.error('❌ Could not find DEV_API_URL pattern in config file');
        return false;
    }
}

function main() {
    console.log('🔍 Finding your local IP address...');

    const ip = getLocalIP();

    if (!ip) {
        console.error('❌ Could not determine your local IP address');
        console.log('💡 Please manually update lib/config.ts with your IP address');
        console.log('   You can find it by running: hostname -I');
        process.exit(1);
    }

    console.log(`✅ Found IP address: ${ip}`);

    if (updateConfigFile(ip)) {
        console.log('✅ Updated lib/config.ts with new IP address');
        console.log('🔄 Please restart your Expo development server');
        console.log(`📱 Your mobile app will now connect to: http://${ip}:9000`);
    } else {
        console.error('❌ Failed to update config file');
        console.log(`💡 Please manually update DEV_API_URL in lib/config.ts to: http://${ip}:9000`);
    }
}

if (require.main === module) {
    main();
}