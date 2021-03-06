# 运行项目

* 从 github 中将项目拉取到本地，利用控制台工具（Windows 使用 cmd，Mac 使用 Terminal） 进入项目目录

* 执行 `npm install` 安装依赖

* 依赖安装完毕之后，执行 `npm run serve`

* 控制台会输出类似信息：

```
App running at:
- Local:   http://localhost:8080/
- Network: http://xx.xx.x.xxx:8080/
```

* 复制 “Local” 或 “Network” 后的 url 到浏览器运行

注意：

* 本地需要安装 node.js（10.0 以上）、npm

# 项目思考

## 数据模块

数据是两份 csv 文件，需要读取、写入。平时开发中对 csv 文件的操作比较简单，都是一次性地读写操作。但是在 hiring 比较复杂一些，hiring 中是将 csv 文件当成数据库来使用。新增账单的数据都是新增到 csv 文件中，每次取数据也是在 csv 文件中取。

一般来说访问效率：访问文件 < 访问数据库 < 访问缓存，在 hiring 中是用访问文件的方式，读、写的效率都不高。所以对于数据的访问，我使用闭包的方式的，在内存中存了一份，除了第一次读数据是读取文件之外，后面的每次都从内存读取。

增加账单分两步，首先将新账单数据增加到内存中，然后再将账单数据持久化到文件中。这里其实会有一些不严谨，以内持久化到文件的过程是异步的，我没有判断是否持久化成功了，我主要是基于以下考虑：

* 每增加一条数据，都会将全量的数据持久化到文件中，等待过程需要时间
* 有一次没写成功也没关系，数据在内存中有，下次增加账单的是还会全量写一次

在平时做的项目中，正常都会把数据存入数据中，比如 hiring 中的账单、账单分类，都会有单独一张表来存储。并且账单分类属于变化不是太频繁又经常要取的数据，所以正常的做法还会将账单分类的数据放在 Redis 中。

## 服务端接口

在 hiring 这个项目中，我没有单独为其写服务端项目。因为当前使用的接口不多，并且只是简单的查询和新增数据。

直接使用 vue-cli 提供的 node.js 服务，写了三个简单的接口。这里服务端的操作比较简单，接口也简单处理。

在商业项目中会有更多的封装，比如统一的错误处理，接口返回格式封装等。

## 前端部分

前端使用 Vue3 + Element plus 开发。由于使用到的 Element puls 的组件并不多，所以采用按需加载的方式。

Vue3 提供的 composition api 可以方便的对业务逻辑做拆分。

### 数据分页

账单的初试数据有40几条，都在一个表格中看起来比较不方便，所以加上了分页，由于文件比较不好操作数据分页，所以分页逻辑放在了前端。

### 严谨性考虑

账单分类是非必填字段，所以对于账单分类不管是数据获取还是数据添加等都有单独为其考虑到。























