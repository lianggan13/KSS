## Vue2

### Yarn

npm install -g yarn

yarn config set registry https://registry.npm.taobao.org -g

### VSCode 插件 

	+ Live Server
	+ Vetur

### Vue  CLI (脚手架)

第一步（仅第一次执行）：全局安装@vue/cli。
	npm install -g @vue/cli
第二步：切换到你要创建项目的目录，然后使用命令创建项目
	vue create xxxx
第三步：启动项目
	npm run serve
备注：配置 npm 淘宝镜像：npm config set registry
			https://registry.npm.taobao.org

### Router

npm i vue-router@3

### Element UI

npm i element-ui

### Less

增强版的 css

npm i less@4.1.2 less-loader@6.0.0



### VueX

组件间通信 —— 集中式状态管理

npm i vuex@3

### Axios

Http Ajax 请求

npm i axios

 ### Mock

生成随机数据 拦截 ajax 请求

npm i mockjs

### Echarts

图表组件

npm i echarts@5.1.2

### Cookie

npm i js-cookie@3.0.1

### 消息订阅--发布

npm i pubsub-js

### Ajax

npm i axios

### 框架

https://pro.antdv.com/docs/router-and-nav

### 发布

npm run build

npm init

npm i express -D

app.js

```
// 创建 Web 服务器
const express = require('express')
const app = express()

// 托管静态资源
app.use(express.static('./dist'))

// 启动 Web 服务器
app.listen(8080,()=>{
    console.log("serve now startup...")
})
```

node .\app.js



## Vue3

### vue安装和npm换镜像
首先检查nmp -v 和 node -v的版本号

安装指定版本npm install -g @vue/cli@版本号

Ps: npm install -g @vue/cli@3.11.0

这里安装可能会很慢, 需要更换npm镜像

查看默认镜像npm get registry

修改淘宝镜像 npm config set registry http://registry.npm.taobao.org/

换成默认镜像 npm config set registry https://registry.npmjs.org/

修改成淘宝镜像再执行npm install -g @vue/cli@3.11.0

安装成功后vue --version查看版本号

```
-g 全局安装
```



### Vue

vue -V


### Vite

+ npm 7+, extra double-dash is needed:
  
  npm create vite@latest my-vue-app -- --template vue
  
  npm create vite@latest my-vue-app
  
+ yarn
yarn create vite my-vue-app --template vue

### Element Plus

```typescript
npm install element-plus --save
npm install @element-plus/icons-vue

npm install element-plus
npm uninstall element-plus

语法提示： 在 文件 tsconfig.app.json 增加如下配置：

"compilerOptions": {
  ...
  "types": ["element-plus/global"],
  ...
}
```



### Router

npm install vue-router -S

### Less

npm i less less-loader

### Vuex

npm i vuex

 ### Mock

生成随机数据 拦截 ajax 请求

npm i mockjs

### Ajax

npm i axios

### TypeScript

vue add typescript 

### CORS

```javascript
devServer: {
    proxy: { // 代理
      '/api': {
        target: 'http://localhost:5034/api',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
```

### Publish

npm run build

dist 目录 发布至 IIS

### Shape 的几种方式

```vue
  <canvas ref="myCanvas" width="400" height="200"></canvas>

Cconst myCanvas = ref(null);

const drawCanvas = () => {
    const canvas = myCanvas.value;
    const ctx = canvas.getContext('2d');

    // 绘制直线
    ctx.beginPath();
    ctx.moveTo(50, 50); // 起点坐标
    ctx.lineTo(350, 150); // 终点坐标
    ctx.strokeStyle = '#3498db'; // 线条颜色
    ctx.lineWidth = 2; // 线条宽度
    ctx.stroke(); // 描边
    ctx.closePath();
};


onMounted(() => {
    drawCanvas();
})


```



### Grid 网格布局

```vue
<template>
  <div class="grid-container">
    <div class="grid-item" v-for="(item, index) in items" :key="index">{{ item }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9']
    };
  }
};
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 列，每列等分剩余空间 */
  grid-template-rows: repeat(3, 100px); /* 3 行，每行高度 100px */
  gap: 10px; /* 网格项之间的间距 */
}

.grid-item {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

```

### SVG 容器

```vue
<rect>：绘制矩形。
<rect x="10" y="10" width="100" height="50" fill="blue" />

<circle>：绘制圆形。
<circle cx="50" cy="50" r="40" fill="red" />

<line>：绘制直线。
<line x1="10" y1="10" x2="100" y2="100" stroke="black" />

<path>：定义路径。
<path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent" />

<polygon>：绘制多边形。
<polygon points="50,5 100,5 125,30 125,80 100,105 50,105 25,80 25,30" fill="green" />

<text>：绘制文本。
<text x="50" y="50" fill="black">Hello, SVG!</text>

<ellipse>：绘制椭圆。
<ellipse cx="80" cy="80" rx="50" ry="30" fill="orange" />

<defs> 和 <use>：定义和重复使用图形元素。
<defs>
  <circle id="myCircle" cx="50" cy="50" r="20" />
</defs>
<use xlink:href="#myCircle" fill="blue" />

<pattern>：定义填充或描边的图案。
<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" stroke-width="0.5" />
</pattern>
<rect width="100%" height="100%" fill="url(#grid)" />

<linearGradient> 和 <radialGradient>：定义渐变效果。
<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
</linearGradient>
<rect width="100" height="100" fill="url(#grad1)" />

```

### 置底

使用 Flexbox 布局

```vue
// 将 el-main 设置为 flex 容器，并且使用 flex-direction: column; 来让其子元素垂直排列。通过给底部内容添加 margin-top: auto;，它会被推到容器的底部。

<template>
  <el-main class="main-container">
    <div class="content">Main Content</div>
    <div class="bottom-content">Bottom Content</div>
  </el-main>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
}

.bottom-content {
  margin-top: auto;
}
</style>
```

使用 Grid 布局

```vue
// 通过 grid-template-rows: auto 1fr auto; 来定义网格布局，让底部内容位于最底部。通过给底部内容添加 align-self: end;，它会被对齐到容器的底部
<template>
  <el-main class="main-container">
    <div class="content">Main Content</div>
    <div class="bottom-content">Bottom Content</div>
  </el-main>
</template>

<style scoped>
.main-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.bottom-content {
  align-self: end;
}
</style>
```

### 居中

```vue
<div style="display: flex;">
	<div style="position: absolute; display: flex;">
		...
	</div>
	<div style="margin-left: auto;margin-right: auto;">
		...
	</div>
</div>
```

#### 文字居中

```css
使用 line-height 与容器的高度相等：
如果你知道文本内容只包含一行，并且容器的高度固定，你可以将 line-height 设置为与容器高度相同的值。这样，文本的上下边界将紧贴容器的上下边界，从而实现垂直居中。

.container {
  height: 100px; /* 容器的固定高度 */
  line-height: 100px; /* 与容器高度相同的行高 */
  /* ... 其他样式 ... */
}

使用Flexbox：
如果你的文本在一个flex容器内，你可以使用Flexbox的对齐属性来实现垂直居中。
.container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  /* ... 其他样式 ... */
}

使用Grid：
类似于Flexbox，Grid也提供了对齐属性，可以用来实现垂直居中。

.container {
  display: grid;
  place-items: center; /* 水平和垂直居中 */
  /* ... 其他样式 ... */
}

```

### 计算属性  &  监视属性

> 计算属性（Computed Properties）

1.用途：

计算属性用于基于已有的数据计算新的数据。它的结果会被缓存，只有在相关依赖发生变化时才会重新计算。计算属性的结果是响应式的，当依赖发生变化时，会自动更新。

2.语法：

定义方式使用 computed 选项，并提供一个返回计算结果的函数。

3.应用场景：

适用于对现有数据执行某种计算，如过滤、排序、格式化等。
在模板中直接引用计算属性，使模板更清晰，代码更简洁

4.例子：

```vue
<template>
  <div>
    <p>Original Message: {{ message }}</p>
    <p>Reversed Message: {{ reversedMessage }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: 'Hello Vue!',
    };
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    },
  },
};
</script>
```



监视属性（Watchers）：

1.用途：

监视属性允许你在数据发生变化时执行自定义的操作。它提供更通用的方式来响应数据的变化，而不仅仅是计算新的值。

2.语法：

定义方式使用 watch 选项，提供一个处理函数，监视指定的数据。

3.应用场景：

当需要在数据变化时执行异步操作，发送网络请求，或进行复杂逻辑处理时，可以使用监视属性。
适用于对数据的变化执行定制的操作。

4.例子：

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  watch: {
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`);
    },
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

总结：
计算属性适用于对已有数据进行计算，结果需要缓存且是响应式的情况。
监视属性适用于对数据变化时执行一些自定义的逻辑，更具灵活性，可以处理异步操作或复杂的业务逻辑。
在大多数情况下，使用计算属性更简洁和直观，而使用监视属性则更适合处理一些需要监听变化并执行特定操作的场景。

