require('dotenv').config();
const axios = require('axios');

(async () => {
  const key = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  console.log('key len:', key ? key.length : 0, '| base:', baseUrl, '| model:', model);
  if (!key || key === 'your-deepseek-api-key') {
    console.log('KEY 未配置，无法测试');
    return;
  }
  try {
    const resp = await axios.post(
      baseUrl + '/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: '你是一位调酒师，请只输出一句话：测试成功。' },
          { role: 'user', content: 'ping' }
        ],
        max_tokens: 50,
        response_format: { type: 'json_object' }
      },
      {
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        timeout: 20000,
      }
    );
    const content = resp.data?.choices?.[0]?.message?.content;
    console.log('AI 调用成功！返回：', content);
  } catch (e) {
    const d = e.response?.data;
    console.log('AI 调用失败：', e.message);
    if (d) console.log('错误详情：', JSON.stringify(d).slice(0, 300));
  }
})();
