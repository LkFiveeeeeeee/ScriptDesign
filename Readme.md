<h3><center>ToDoS文档</center></h3>

<center>1651573 刘客</center>

-----

## 1.  功能实现情况

**基本功能**

- [x] 新增 ```ToDo```
- [x] 展现```ToDo```列表
- [x] 删除```ToDo``` (右滑删除)
- [x] 全部完成/取消
- [x] 删除已完成
- [x] 保存页面状态

**高级功能**

- [x]  以dialog的形式新建或者编辑```ToDo```
- [x]  ```ToDo```具有三种颜色的标签(E,M,L)，分别代表紧急、中等、以及不太紧急的事务
- [x]  多级过滤 [第一级(all, active, completed), 第二级(emergency, medium, low), 第三级(date)]
- [x]  ```ToDo```中具有 DDL
- [x]  可通过左滑```ToDo```更换标签
- [x]  动画效果，包括显示、隐藏```ToDo```表项，以及部分按钮的现实和隐藏
- [x]  DDL 临近日期变色
- [x]  App提供四种4格颜色进行变换

**亮点**
+ 通过二次曲线绘制的文字
+ todo count动态计数，在不同的过滤条件下可以仅技术选中的过滤项，并且如果可以clear，也只clear对应的todo items.
+ 按钮的动态消隐，在不同的过滤条件下，会判断相应的情况，进行显示或者隐藏

## 2. 文档目录与借鉴代码情况

```
Final
|
|-- resources
|      |-- smell.png
|
|-- model.js
|
|-- provider.js
|
|-- timeformat.js
|
|-- todo-list.js
|
|-- todo-list.css
|
|-- Readme
```

其中 model.js 以及 provider.js 参考了老师的实现，但是model要存储的东西根据我的情况进行调整，我个人认为已经理解了其中的代码逻辑。

todo-list.css 中的部分样式参考了老师上课时展示的todo-mvc风格即字体和阴影等样式，但是从布局上来说做了比较大的改动，把很多相对定位绝对定位的样式转变为float实现以及做了很多样式上的调整。

todo-list.html 参考了部分页面结构的实现，但我自己做了非常大的调整。

### 3. 一些功能展示

> 添加ToDo

![AddToDo](record/AddToDo.gif)

> 编辑ToDo以及ddl变色

![EditToDo](record/EditToDo.gif)

> 滑动删除

![delete](record/delete.gif)

> 左滑更改tag

![changeTag](record/changeTag.gif)

> 风格变色

![changeColor](record/changeColor.gif)

> 多级动态过滤

![multiple filters](record/multiple filters.gif)