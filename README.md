# Image Generation Service

基于 RunningHub ComfyUI API 的图片生成服务，提供类似 SiliconFlow 的简洁 REST API 接口。

## 功能特性

- 🎨 简洁的 REST API 接口
- 🌏 完美支持中文提示词
- 📐 支持 9 种图片尺寸比例
- ⚙️ 可配置推理步数、引导比例、随机种子
- 🔄 异步任务处理，支持状态查询
- 🚀 基于 RunningHub 的 ComfyUI 工作流

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或使用 bun
bun install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# RunningHub API 配置
RUNNINGHUB_API_KEY=your-api-key-here
RUNNINGHUB_BASE_URL=https://www.runninghub.cn
RUNNINGHUB_WORKFLOW_ID=your-workflow-id

# 服务端口
PORT=4111

# 图片生成默认参数
DEFAULT_IMAGE_SIZE=1024x1024
DEFAULT_STEPS=20
DEFAULT_CFG_SCALE=2.5
DEFAULT_BATCH_SIZE=1

# 可选配置
RETAIN_SECONDS=60
```

### 3. 启动服务

```bash
npm start
# 或使用 bun
bun start
```

服务启动后会显示：

```
Image Generation Service running on port 4111
Health check: http://localhost:4111/health
API endpoint: http://localhost:4111/v1/images/generations
```

## API 使用文档

### 基础信息

- **Base URL**: `http://localhost:4111`
- **Content-Type**: `application/json; charset=utf-8`
- **编码**: UTF-8（完美支持中文）

---

### 1. 创建图片生成任务

**端点**: `POST /v1/images/generations`

**请求示例**:

```bash
curl -X POST "http://localhost:4111/v1/images/generations" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "prompt": "一只可爱的橘色小猫，蓝色大眼睛",
    "image_size": "896x1152",
    "num_inference_steps": 20
  }'
```

**PowerShell 示例**:

```powershell
$body = @{
    prompt = "一只可爱的橘色小猫，蓝色大眼睛"
    image_size = "896x1152"
    num_inference_steps = 20
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4111/v1/images/generations" `
  -Method Post `
  -Body $body `
  -ContentType "application/json; charset=utf-8"
```

**JavaScript/TypeScript 示例**:

```javascript
const response = await fetch('http://localhost:4111/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify({
    prompt: '一只可爱的橘色小猫，蓝色大眼睛',
    image_size: '896x1152',
    num_inference_steps: 20
  })
});

const result = await response.json();
console.log('Task ID:', result.task_id);
```

**Python 示例**:

```python
import requests

response = requests.post(
    'http://localhost:4111/v1/images/generations',
    headers={'Content-Type': 'application/json; charset=utf-8'},
    json={
        'prompt': '一只可爱的橘色小猫，蓝色大眼睛',
        'image_size': '896x1152',
        'num_inference_steps': 20
    }
)

result = response.json()
print(f"Task ID: {result['task_id']}")
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 | 默认值 |
|------|------|------|------|--------|
| prompt | string | ✅ 是 | 图片描述文本（支持中文） | - |
| negative_prompt | string | 否 | 要避免的内容 | 预设负面提示词 |
| image_size | string | 否 | 图片尺寸 | 1024x1024 |
| num_inference_steps | int | 否 | 推理步数 (1-100) | 20 |
| guidance_scale | float | 否 | 引导比例 (1.0-20.0) | 2.5 |
| seed | int | 否 | 随机种子（固定种子可复现结果） | 随机生成 |
| batch_size | int | 否 | 批量生成数量 | 1 |

**支持的图片尺寸**:

| 尺寸 | 比例 | 说明 | 适用场景 |
|------|------|------|----------|
| `1024x1024` | 1:1 | 正方形 | 头像、图标、社交媒体 |
| `896x1152` | 3:4 | 竖版 | 手机壁纸、海报 |
| `832x1216` | 5:8 | 竖版 | 手机屏幕 |
| `768x1344` | 9:16 | 竖版 | 短视频封面 |
| `640x1536` | 9:21 | 超长竖版 | 长图、信息图 |
| `1152x896` | 4:3 | 横版 | 传统显示器 |
| `1216x832` | 3:2 | 横版 | 相机照片 |
| `1344x768` | 16:9 | 横版 | 宽屏显示器、视频封面 |
| `1536x640` | 21:9 | 超宽横版 | 超宽屏、横幅 |

**响应示例**:

```json
{
  "task_id": "2045706467323027458",
  "status": "RUNNING",
  "client_id": "f3dd11024769d60f41b911919362ba81",
  "seed": 363598077840780,
  "message": "Task created successfully. Use /v1/images/status/:taskId to check status and /v1/images/result/:taskId to get result."
}
```

---

### 2. 查询任务状态

**端点**: `GET /v1/images/status/:taskId`

**请求示例**:

```bash
curl "http://localhost:4111/v1/images/status/2045706467323027458"
```

**响应示例**:

```json
{
  "task_id": "2045706467323027458",
  "status": "RUNNING",
  "error_code": "",
  "error_message": ""
}
```

**任务状态说明**:

| 状态 | 说明 |
|------|------|
| `QUEUED` | 排队中 |
| `RUNNING` | 执行中 |
| `SUCCESS` | 成功完成 |
| `FAILED` | 执行失败 |

---

### 3. 获取生成结果

**端点**: `GET /v1/images/result/:taskId`

**请求示例**:

```bash
curl "http://localhost:4111/v1/images/result/2045706467323027458"
```

**成功响应示例**:

```json
{
  "images": [
    {
      "url": "https://rh-images-1252422369.cos.ap-beijing.myqcloud.com/xxx/output/ComfyUI_00006_pcnjd_1776569435.png",
      "output_type": "png"
    }
  ],
  "task_id": "2045706467323027458",
  "status": "SUCCESS"
}
```

**处理中响应** (HTTP 202):

```json
{
  "task_id": "2045706467323027458",
  "status": "RUNNING",
  "message": "Task is still processing"
}
```

**失败响应** (HTTP 500):

```json
{
  "error": {
    "code": "task_failed",
    "message": "Task execution failed"
  },
  "task_id": "2045706467323027458",
  "status": "FAILED"
}
```

---

### 4. 健康检查

**端点**: `GET /health`

**请求示例**:

```bash
curl "http://localhost:4111/health"
```

**响应示例**:

```json
{
  "status": "ok",
  "service": "image-generation-service"
}
```

---

## 完整使用流程示例

### Node.js/JavaScript

```javascript
async function generateImage(prompt, imageSize = '1024x1024') {
  // 1. 创建任务
  const createResponse = await fetch('http://localhost:4111/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      prompt,
      image_size: imageSize,
      num_inference_steps: 20
    })
  });
  
  const { task_id } = await createResponse.json();
  console.log('任务创建成功，ID:', task_id);
  
  // 2. 轮询查询结果
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待 3 秒
    
    const resultResponse = await fetch(`http://localhost:4111/v1/images/result/${task_id}`);
    const result = await resultResponse.json();
    
    if (result.status === 'SUCCESS') {
      console.log('生成成功！');
      console.log('图片 URL:', result.images[0].url);
      return result.images[0].url;
    } else if (result.status === 'FAILED') {
      throw new Error('生成失败');
    }
    
    console.log('生成中...');
  }
}

// 使用示例
generateImage('一只可爱的橘色小猫', '896x1152')
  .then(url => console.log('完成！', url))
  .catch(err => console.error('错误:', err));
```

### Python

```python
import requests
import time

def generate_image(prompt, image_size='1024x1024'):
    # 1. 创建任务
    response = requests.post(
        'http://localhost:4111/v1/images/generations',
        headers={'Content-Type': 'application/json; charset=utf-8'},
        json={
            'prompt': prompt,
            'image_size': image_size,
            'num_inference_steps': 20
        }
    )
    
    task_id = response.json()['task_id']
    print(f'任务创建成功，ID: {task_id}')
    
    # 2. 轮询查询结果
    while True:
        time.sleep(3)  # 等待 3 秒
        
        result_response = requests.get(
            f'http://localhost:4111/v1/images/result/{task_id}'
        )
        result = result_response.json()
        
        if result['status'] == 'SUCCESS':
            print('生成成功！')
            image_url = result['images'][0]['url']
            print(f'图片 URL: {image_url}')
            return image_url
        elif result['status'] == 'FAILED':
            raise Exception('生成失败')
        
        print('生成中...')

# 使用示例
url = generate_image('一只可爱的橘色小猫', '896x1152')
print(f'完成！{url}')
```

---

## 项目结构

```
.
├── src/
│   ├── config/
│   │   └── workflow.js       # ComfyUI 工作流配置和节点 ID
│   ├── routes/
│   │   └── images.js         # 图片生成 API 路由
│   ├── services/
│   │   └── runninghub.js     # RunningHub API 服务封装
│   ├── utils/
│   │   └── imageSize.js      # 图片尺寸配置和工具函数
│   └── index.js              # 应用入口
├── .env                      # 环境变量配置（不提交到 git）
├── .env.example              # 环境变量示例
├── .gitignore
├── package.json
├── lmage_api.json            # ComfyUI 工作流 JSON
└── README.md
```

---

## 高级配置

### Webhook 回调

在 `.env` 中配置 `WEBHOOK_URL`，任务完成后 RunningHub 会自动推送结果到你的服务器：

```env
WEBHOOK_URL=https://your-domain.com/webhook
```

Webhook 推送的数据格式：

```json
{
  "event": "TASK_END",
  "taskId": "1904163390028185602",
  "eventData": "{\"code\":0,\"msg\":\"success\",\"data\":[{\"fileUrl\":\"...\",\"fileType\":\"png\",\"nodeId\":\"9\"}]}"
}
```

### 实例类型

使用 48G 显存的 Plus 机器（更快，成本更高）：

```env
INSTANCE_TYPE=plus
```

### 实例保留时长

企业共享 API Key 可设置实例保留时长（10-180秒），减少冷启动时间：

```env
RETAIN_SECONDS=60
```

注意：保留时段会产生额外费用。

---

## 常见问题

### 1. 中文乱码问题

确保请求头包含 `charset=utf-8`：

```
Content-Type: application/json; charset=utf-8
```

### 2. 图片尺寸不支持

请使用文档中列出的 9 种预设尺寸，这些尺寸与 ComfyUI 工作流的 aspect_ratio 选项对应。

### 3. 任务一直处于 RUNNING 状态

正常情况下图片生成需要 15-30 秒，请耐心等待。如果超过 2 分钟仍未完成，可能是工作流配置问题或 RunningHub 服务异常。

### 4. 生成的图片不符合预期

- 调整 `num_inference_steps`（推荐 20-50）
- 调整 `guidance_scale`（推荐 5-10）
- 优化提示词描述
- 使用 `negative_prompt` 排除不想要的元素

### 5. 如何获取 RunningHub API Key 和 Workflow ID

1. 访问 [RunningHub 官网](https://www.runninghub.cn)
2. 注册并登录账号
3. 在控制台获取 API Key
4. 创建或导入 ComfyUI 工作流，获取 Workflow ID

---

## 性能优化建议

1. **使用固定种子**：相同的 prompt + seed 会生成相同的图片，适合 A/B 测试
2. **批量生成**：设置 `batch_size > 1` 可一次生成多张图片
3. **实例保留**：高频调用时设置 `RETAIN_SECONDS` 减少冷启动
4. **Webhook 回调**：避免频繁轮询，使用 webhook 接收结果通知

---

## 注意事项

1. ✅ 确保 RunningHub API Key 有效且有足够的配额
2. ✅ Workflow ID 需要在 RunningHub 平台创建并获取
3. ✅ 图片生成是异步任务，需要轮询状态或使用 webhook
4. ✅ 推理步数越多质量越好但速度越慢（推荐 20-30）
5. ✅ guidance_scale 越高越严格遵循 prompt（推荐 5-10）
6. ✅ 请求必须使用 UTF-8 编码以支持中文

---

## License

MIT
