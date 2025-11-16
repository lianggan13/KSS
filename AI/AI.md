## AI

---

### 面向程序员应对 AI 自动化风险

- 提升不可轻易被替代的技能  
  - 深化领域知识（安全、嵌入式、工业控制、金融风控等），这些领域对上下文与经验要求更高。  

- 学会和 AI 协作（把 AI 当工具而不是对手）  
  - 掌握提示工程、自动化流水线、AI 集成与调试，让自己成为能把 AI 产出商业化的人。  

- 向更高价值的岗位迁移  
  - 转向架构师、系统设计、产品/技术管理、DevOps/MLops、数据工程等需要全局视野与沟通协调的角色。  

- 专注软技能与跨职能能力  
  - 提升沟通、影响力、项目管理与业务理解，这些决定能否推动产品落地。  

- 学会构建和维护基础设施与工具链  
  - 负责模型部署、监控、治理、合规与性能优化，这些是自动化难以完全替代的工程工作。  

- 保持持续学习与小规模实验  
  - 设定学习计划（每季度学一个新工具/领域），通过侧项目或开源贡献积累可展示成果的作品集。  

- 考虑创业或自由职业路径  
  - 利用行业经验做咨询、定制化解决方案或小型产品，AI 可以降低门槛但不会消除差异化能力。  

- 与公司积极沟通，争取转型机会  
  - 主动提出用 AI 提高团队效率的方案，争取接受再培训或承担 AI 相关更高阶职责。  

总结：把注意力从“被取代”转向“如何用 AI 放大自己的价值”。短期内通过学习与角色调整可以显著降低被替代风险并创造更多机会。

### Miniconda

- 下载：

  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/
  - Miniconda3-py38_23.1.0-1-Windows-x86_64.exe

- 创建与管理环境（PowerShell）：

```powershell
conda create -n yolov5 python=3.8
conda activate yolov5
# 退出环境
conda deactivate

# PIP 源（清华）
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple

# 或者直接修改 .condarc 文件
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud


pip install keras-applications -i https://pypi.org/simple
```

```
```



---

### PyTorch 

- 历史版本说明：https://pytorch.org/get-started/previous-versions/

```powershell
pip3 install torch==1.8.2 torchvision==0.9.2 torchaudio==0.8.2 `
    --extra-index-url https://download.pytorch.org/whl/lts/1.8/cu111
    
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

验证 CUDA：

```powershell
python - << 'PY'
import torch
print('Torch:', torch.__version__)
print('CUDA available:', torch.cuda.is_available())
print('CUDA test:', torch.ones(3).cuda() if torch.cuda.is_available() else 'No CUDA')
PY
```

---

### YOLOv5 

- 仓库：https://github.com/ultralytics/yolov5

依赖要求（如需固定版本，可在 requirements.txt 中调整）：

- numpy>=1.18.5 → 建议固定为 numpy==1.20.3
- Pillow>=7.1.2 → 建议固定为 Pillow==8.3.0

安装依赖与基础推理：

```powershell
pip install -r requirements.txt

# 基础推理
python detect.py
python detect.py --weights yolov5s.pt
python detect.py --weights yolov5s.pt --source data\images\bus.jpg
python detect.py --weights yolov5s.pt --source screen
```

交互式环境（Jupyter）：

```powershell
# 如需 Jupyter（如不需要可忽略）


# 可选：不同镜像安装 jupyterlab（三选一）
# pip install jupyterlab -i http://pypi.doubanio.com/simple/ --trusted-host pypi.doubanio.com
# pip install jupyterlab -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
# pip install jupyterlab -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn
```

关键参数说明：

- weights：预训练权重文件
- data：数据集描述文件
- iou-thres：NMS 重叠抑制阈值
- conf-thres：置信度阈值（先按 conf-thres 丢弃低置信预测 → 再基于 iou-thres 执行 NMS）

示例：

```powershell
python detect.py --weights yolov5s.pt --iou-thres 0.01
python train.py --weights yolov5s.pt --data data/drowsiness.yaml
```

---

### 数据集与标注

来源：

1. 直接收集原始图片集
2. 视频 → OpenCV 抽帧（extra_video.ipynb）→ 原始图片集

标注工具（YOLO 格式）：

```powershell
pip install labelimg
labelimg   # 启动
```

设置：

- Auto Save Mode（自动保存）
- YOLO（存图/标签格式）

类别样例：[Eyeclosed, Eyeopened]

---

### 模型训练

数据划分与目录：

- images
  - train：训练集图片
  - valid：验证集图片
- labels（与 images 同结构，一一对应）
  - train：训练集标签
  - valid：验证集标签

训练命令示例：

```powershell
python train.py --weights yolov5s.pt --data Drowsiness/drowsiness.yaml
python train.py --weights yolov5s.pt --data Drowsiness/drowsiness.yaml --epochs 300 --device 0
python train.py --weights yolov5s.pt --data Drowsiness/drowsiness.yaml --workers 1

python train.py --epochs 300 --device 0

python train.py --weights yolov5s.pt --data WorkerSafety/workersafety.yaml --epochs 100  --batch-size -1 --workers 12 --device 0

python train.py --resume runs\train\exp5\weights\last.pt
```


可视化（TensorBoard）：

```powershell
tensorboard --logdir runs
```

训练后的推理示例：

```shell
python detect.py --weights runs\train\exp5\weights\best.pt `
    --source .\Drowsiness\data\videos\video.mp4 --view-img

python detect.py --weights runs\train\exp11\weights\best.pt `
    --source .\Drowsiness\data\images\frame_25.jpg --view-img

python detect.py --weights runs\train\exp10\weights\best.pt `
    --source Drowsiness\images\test\948_jpg.rf.85bc964df7ba8df432bbbcbbfda83d20.jpg --view-img
```

常见问题：

- 报错“页面文件太小，无法完成操作”
  1. 训练参数中的 workers 设为 1：`--workers 1`
  2. 调大 Windows 虚拟内存（将环境所在盘设置较大的页面文件）

---

### GUI 

PySide6 / Qt for Python：

```powershell
pip install pyside6
where python
# 参考：D:\App\miniconda3\envs\yolov5\Lib\site-packages\PySide6 -> designer.exe
```

- VS Code 扩展：Qt for Python
- 在资源管理器中对 `main_window.ui` 使用 “Compile Qt UI File”

Gradio（Web GUI）：

```powershell
pip install gradio
```

---

### [Ultralytics  YOLO ](https://docs.ultralytics.com/zh/tasks/detect/)

```
conda create -n ultralytics python=3.10
conda activate ultralytics

pip install -r requirements.txt
```

```python
from ultralytics import YOLO

# Load a model
model = YOLO("yolo11n.yaml")  # build a new model from YAML
model = YOLO("yolo11n.pt")  # load a pretrained model (recommended for training)
model = YOLO("yolo11n.yaml").load("yolo11n.pt")  # build from YAML and transfer weights

# Train the model with 2 GPUs
results = model.train(data="coco8.yaml", epochs=100, imgsz=640, device=[0, 1])

# Train the model with the two most idle GPUs
results = model.train(data="coco8.yaml", epochs=100, imgsz=640, device=[-1, -1])

# Load a model
model = YOLO("path/to/last.pt")  # load a partially trained model

# Resume training
results = model.train(resume=True)
```



### DataSets

[Kaggle](https://www.kaggle.com/search?q=worker+safety+in%3Adatasets) https://www.kaggle.com/search?q=worker+safety+in%3Adatasets



### 神经网络模型

```markdown
The most important neural net architectures: feedforward neural nets for tabular data; convolutional nets for computer vision; recurrent nets and long short-term memory (LSTM) nets for sequence processing; encoder–decoders, transformers, state space models (SSMs), and hybrid architectures for natural language processing, vision, and more; autoencoders, generative adversarial networks (GANs), and diffusion models for generative learning
```

### Machine Learn (ML)

A computer program is said to learn from experience E with respect to some task T and some performance measure P, if its performance on T, as measured by P, improves with experience E.

![](Images\ML.png)

### English

1️⃣ 定语从句（Attributive Clause）

**定义**

- 用来修饰**名词或代词**的从句。
- 作用：给名词补充说明，让它更具体。

**常见引导词**

- **关系代词**：who, whom, whose, which, that
- **关系副词**：where（地点）、when（时间）、why（原因）

**位置**

- **紧跟**被修饰的名词或代词之后。

**例句**

> This is the place **where we met**. （这是我们相遇的地方。）

- 主句：This is the place
- 定语从句：where we met（修饰 place）

2️⃣ 状语从句（Adverbial Clause）

**定义**

- 用来修饰**动词、形容词、副词或整个句子**的从句。
- 作用：说明时间、原因、条件、目的、结果、让步、方式、地点等。

**常见引导词**

- 时间：when, while, before, after, as soon as
- 原因：because, since, as
- 条件：if, unless, provided that
- 让步：although, though, even if
- 结果/目的：so that, in order that
- 地点：where（表示“在……地方”时）

**位置**

- 可以在句首或句尾，位置灵活。

**例句**

> **Where there is smoke**, there is fire. （哪里有烟，哪里就有火。）

- 状语从句：Where there is smoke（表示地点条件，修饰整个主句）

3️⃣ 快速区分方法

| 对比点   | 定语从句                                | 状语从句                                     |
| -------- | --------------------------------------- | -------------------------------------------- |
| 修饰对象 | 名词/代词                               | 动词、形容词、副词或整个句子                 |
| 功能     | 描述“是什么”                            | 描述“为什么、何时、如何、在何处”             |
| 位置     | 紧跟名词                                | 句首或句尾                                   |
| 引导词   | who, which, that, where, when, whose 等 | because, if, although, when, where, since 等 |
| 判断技巧 | 去掉从句，主语的名词信息会缺失          | 去掉从句，主句依然完整但少了背景信息         |


---


### Book

[11.人脸检测与识别 | 工程师应用机器学习与人工智能](https://learning.oreilly.com/library/view/gong-cheng-shi-ying-yong-ji-qi-xue-xi-yu-ren-gong-zhi-neng/9798341657779/ch11.html#handling_unknown_faces_closed_set_versu)
