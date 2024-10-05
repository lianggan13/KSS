## Docker

**菜鸟教程 https://www.runoob.com/docker/docker-dockerfile.html**

<img src="Images\docker.png" alt="微服务架构图" style="zoom:80%;" />

<img src="Images\MicroServices.png" alt="微服务架构图" style="zoom:80%;" />

+ 镜像 Image
+ 容器 container
+ 仓库 repository

|            | VMware 虚拟机              | Docker 容器              |
| ---------- | -------------------------- | ------------------------ |
| 操作系统   | 宿主机OS上运行虚拟机OS     | 与宿主机共享OS           |
| 存储大小   | 镜像庞大 (vmdk. vdi等）    | 镜像小，便于存储与传输   |
| 运行性能   | 几乎无额外性能损失         | 几乎无额外性能损失       |
| 移植性     | 笨重，与虚拟化技术耩合度高 | 轻便、灵活，适应于 Linux |
| 硬件亲和性 | 面向硬件运维者             | 面向软件开发者           |
| 部署速度   | 较慢，10s以上              | 快速，秒级               |
|            |                            |                          |



### Command

```c#
docker search

docker pull <image name>  // 拉取镜像 如: microsoft/mssql-server-linux (SQL server)
docker images // 查看镜像
docker images -a
docker images -q
docker images -aq
docker ps // 运行中的容器
docker ps -a // 所有容器状态
docker stop <container name>
docker start <container name>
docker restart <container name>
docker update --restart=always <container name> // 容器自启动
docker rmi <image name> // 删除镜像
docker rm <container name> // 删除容器(删除前需要先停止容器)
docker rm -f <container name> // 强制删除容器
docker image ls -f dangling=true // 显示虚悬镜像
docker image prune -a -f // 删除虚悬镜像
docker stop $(docker ps -q) & docker rm $(docker ps -aq) // 停用并删除全部容器
docker rm -f $(docker ps -a -q)
docker ps -a -q | xargs docker rm
    


// 构建镜像
docker build -t <image name> -f <PATH: dockfile> <PATH: context>
ex: docker build -t webapp -f ./ASIS/ASIS.Server/Dockerfile . --network host
	docker build -t web-img -f Dockerfile ../.. --network host

// 运行容器
docker run -p 8009:80 --name <container name> <image name>
docker run -it --name=<container name> --rm <image name> // run once 容器停止时，自删除
ex: docker run -p 8009:80 --name webappinstance webapp
    docker run -itd -p 8009:80 --name webappinstance webapp

// 查看容器
docker exec -it <container id> /bin/bash // 进入容器内部 -i: interactive -t:terminal
	> exit 
    > ctrl + p + q
docker attach <container id>
docker logs <container id>
docker inspect <container id>
        
// 持久化容器
docker cp <container id>:<filePath1> <filePath2>
ex: docker cp 502f22ae9b25:/data/t1.txt .

docker export <container id> > <filePath>
ex: docker export 502f22ae9b25 > abcd.tar

cat <filePath> | docker import - <image name>:<tag>
ex: cat abcd.tar | sudo docker import - pkg/redis:0.1.3

docker commit // 提交容器副木使之成为一个新的镜像
docker commit -m="提交的描述信息" -a="作者" 容器ID 目标镜像名:标签名
ex: docker commit -m="add vim" -a="lg13" 908fd0df59c1 lg_ubuntu:1.3.0
    
docker run -it --privileged=true -v /宿主机绝对路径日录:/容器内目录: 镜像名	// 映射容器卷
ex: docker run -it --privileged=true -v /mydocker/u:/tmp/u --name u1 ubuntu /bin/bash
```



### Windows10

```
阿里云镜像加速器
"registry-mirrors":["https://jgnv1bqb.mirror.aliyuncs.com"],
```

### Ubuntu

```c#
ref: https://docs.docker.com/engine/install/ubuntu/

1.更新源(使用阿里云源)
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak_20221120
    
    deb http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse

    deb http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse

    deb http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse

    # deb http://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse
    # deb-src http://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse

    deb http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
    
sudo apt update

2.安装必要的依赖软件
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

3.导入源仓库的 GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

4.将 Docker apt 软件源添加到系统
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

5.添加完成后再次更新 apt 源
sudo apt update

6.开始安装docker
sudo apt install docker-ce docker-ce-cli containerd.io

7.查看是否安装成功
sudo docker --version

8.设置Docker开机自启
sudo systemctl enable docker

9.设置 DNS
sudo vi /etc/default/docker
     DOCKER_OPTS="--dns 8.8.8.8 --dns 114.114.114.114"
   
10.重启
sudo service docker stop
sudo service docker start
    
11.阿里云镜像
控制台>>容器镜像服务>> 镜像工具 镜像加速器
```

### KyLin

> 离线安装.NET环境 

```
下载离线安装包 https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Linux X64
dotnet-sdk-6.0.425-linux-x64.tar.gz

复制
复制到如下目录：
/usr/local/dotnet/dotnet-sdk-6.0.425-linux-x64.tar.gz

解压
cd /usr/local/dotnet/
tar -zxvf dotnet-sdk-6.0.425-linux-x64.tar.gz

创建软链接
ln -s /usr/local/dotnet/dotnet /bin

编辑 /etc/profile 文件
vim /etc/profile
添加如下内容：
export PATH=$PATH:/usr/local/dotnet
export DOTNET_ROOT=/usr/local/dotnet

使立即生效：
source /etc/profile
```

> 安装 Docker

```json
参考链接：https://juejin.cn/post/7349189143799611419

https://download.docker.com/linux/static/stable/x86_64/
docker-27.2.0.tgz 

下载安装包
wget https://download.docker.com/linux/static/stable/x86_64/docker-27.2.0.tgz 
解压
tar -zxvf docker-27.2.0.tgz
移动解压出来的二进制文件到 /usr/bin 目录中
mv docker/* /usr/bin/

配置添加 systemd
编辑docker的系统服务文件
vi /usr/lib/systemd/system/docker.service
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target

[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s
[Install]
WantedBy=multi-user.target

创建docker配置文件
mkdir -p /etc/docker
vim /etc/docker/daemon.json

{
  "registry-mirrors": [
     "https://bxsfpjcb.mirror.aliyuncs.com"
  ],
  "max-concurrent-downloads": 10,
  "log-driver": "json-file",
  "log-level": "warn",
  "log-opts": {
    "max-size": "50m",
    "max-file": "1"
    },
  "insecure-registries":
        ["127.0.0.1"],
  "data-root":"/var/lib/docker"
}

重新加载和重启docker
systemctl daemon-reload
systemctl restart docker

docker --version

配置镜像加速器
https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6

{
  "registry-mirrors": [
	"https://docker.m.daocloud.io",
	"https://dockerhub.azk8s.cn",
	"https://docker.mirrors.ustc.edu.cn"
	],
  "exec-opts": ["native.cgroupdriver=systemd"]
}

```

> Net6.0

```c#
dotnet ASIS.Server.dll --urls=http://*:5000


 var host = _httpContextAccessor.HttpContext.Request.Host;
 var ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress;
```



### MongoDB

```json
https://blog.csdn.net/packge/article/details/126539320


docker-compose.yml
https://blog.csdn.net/weixin_41352552/article/details/130283018


docker pull mongodb/mongodb-community-server:latest
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
    

docker pull mongo:4.4
docker pull mongo:latest
docker run -d -p 27017:27017 --name mymongo mongo

docker run -it -p 27016:27017 --ip 0.0.0.0 --name mymongo --rm mongo

docker run -it -p 27016:27017 -v C:/Users/67602/Desktop/mongo/data/configdb:/data/configdb -v C:/Users/67602/Desktop/mongo/data/db:/data/db --ip 0.0.0.0 --name mymongo --rm mongo

docker run -it -p 27017:27017 -v /root/docker/docker_volume/mongodb/data/configdb:/data/configdb -v /root/docker/docker_volume/mongodb/data/db:/data/db --ip 0.0.0.0 --name mymongo --rm mongo

docker exec -it mymongo mongosh
    
关闭防火墙
# centos 麒麟
firewall-cmd --zone=public --add-port=27017/tcp --permanent  && firewall-cmd --reload
# ubantu
sudo ufw allow 27017


```

### MySql

```c#
docker pull mysql:5.7
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
ex: docker run -p 3306:3306  -e MYSQL_ROOT_PASSWORD=1918 -d mysql:5.7
ex: docker run -p 3306:3306  -e MYSQL_ROOT_PASSWORD=1918 -d --network host mysql:5.7	// 网络 Host 模式
ex: docker exec -it d0662af2c5ea /bin/bash
ex:		mysql> mysql -uroot -p
ex:		mysql> show databases;
ex:		mysql> create database db01;
ex:		mysql> use db01;
ex:		mysql> create table t1(id int,name varchar(20));
ex:		mysql> insert into t1 values(1,'lg');
ex:		mysql> select * from t1;


docker run -d -p 3306:3306 --privileged=true -v /home/zhangliang/Store/Mysql/log:/var/log/mysql -v /home/zhangliang/Store/Mysql/data:/var/lib/mysql -v /home/zhangliang/Store/Mysql/conf:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=1918 --name mysql mysql:5.7
```

### Redis

```c#
docker run -d -p 6379:6379 --privileged=true -v /home/zhangliang/Store/Redis/redis.conf:/etc/redis/redis.conf -v /home/zhangliang/Store/Redis/data:/data --name redis redis:6.0.8 redis-server /etc/redis/redis.conf

redis cluster

启动 6 个redis 容器实例
docker run -d --name redis-node-1 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-1:/data redis --cluster-enabled yes --appendonly yes --port 6381

docker run -d --name redis-node-2 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-2:/data redis --cluster-enabled yes --appendonly yes --port 6382

docker run -d --name redis-node-3 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-3:/data redis --cluster-enabled yes --appendonly yes --port 6383

docker run -d --name redis-node-4 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-4:/data redis --cluster-enabled yes --appendonly yes --port 6384

docker run -d --name redis-node-5 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-5:/data redis --cluster-enabled yes --appendonly yes --port 6385

docker run -d --name redis-node-6 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-6:/data redis --cluster-enabled yes --appendonly yes --port 6386

--net host				使用宿主机的IP和端口
--privileged=true		获取宿主机root用户权限
-v /data/redis/share/redis-node-6:/data		容器卷，宿主机地址:docker内部地址
--cluster-enabled yes	开启redis集群
--appendonly yes		开启持久化


构建主从关系(3主3从)
// 注意，进入docker容器后才能执行一下命令，且注意自己的真实IP地址
docker exec -it redis-node-1 /bin/bash
> redis-cli --cluster create 192.168.7.128:6381 192.168.7.128:6382 192.168.7.128:6383 192.168.7.128:6384 192.168.7.128:6385 192.168.7.128:6386 --cluster-replicas 1

--cluster-replicas 1 表示为每个master创建一个slave节点

进入 某个 redis (-c 防止路由失效)
redis-cli -p 6381 -c

cluster info // 查看集群状态
cluster nodes // 查看节点状态

// 查看集群状态(从容器内)
redis-cli --cluster check 192.168.7.128:6382

案例：容错切换迁移
// 停止 6381
sudo docker stop redis-node-1	
// 查看节点信息 6381 已断连，6384主动上位
cluster nodes					
// 恢复
sudo docker start redis-node-1
sudo docker stop redis-node-4
sudo docker start redis-node-4

案例：主从扩容
// 运行两个 redis 容器实例(端口：6387、6388)
docker run -d --name redis-node-7 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-7:/data redis --cluster-enabled yes --appendonly yes --port 6387
docker run -d --name redis-node-8 --net host --privileged=true -v /home/zhangliang/Store/Redis/redis-node-8:/data redis --cluster-enabled yes --appendonly yes --port 6388

// 将新增的6387节点(空槽号)作为master节点加入原集群
// 6387: 将要作为master新增节点		6381: 原来集群节点里面的领路人
sudo docker exec -it redis-node-7 /bin/bash
	> redis-cli --cluster add-node 0.0.0.0:6387 0.0.0.0:6381
cluster info

// 为6387重新分配槽号
redis-cli --cluster reshard 0.0.0.0:6381
How many slots do you want to move (from 1 to 16384)? 4096	// 16384/master节点数
What is the receiving node ID? 4e21eb8f7367e23784d40efb8c94f4ec263e8e20 // 6387的节点id
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node #1: all
...

// 为主节点6387分配从节点6388
redis-cli --cluster add-node 0.0.0.0:6388 0.0.0.0:6387 --cluster-slave --cluster-master-id 4e21eb8f7367e23784d40efb8c94f4ec263e8e20

案例：主从缩容

// 删除从节点6388
redis-cli --cluster del-node 0.0.0.0:6388 8795f9a682390f516116263e30378581811c3ef6

// 将6387的槽号清空，重新分配，本例将清出来的槽号都给6381
redis-cli --cluster reshard 0.0.0.0:6381
How many slots do you want to move (from 1 to 16384)? 4096
What is the receiving node ID? 099f9c570e6b05bdad457ff9f1b6151f67e882a5
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node #1: 4e21eb8f7367e23784d40efb8c94f4ec263e8e20
Source node #2: done
...

// 删除主节点6387
redis-cli --cluster del-node 0.0.0.0:6387 4e21eb8f7367e23784d40efb8c94f4ec263e8e20


```



### Registry



```c#
aliyun docker repository
   	docker login --username=15694047739 registry.cn-hangzhou.aliyuncs.com
		> Password: G15608212470*

	docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/zhangliang-yun/zhangliang-docker-repository:[镜像版本号]
	docker push registry.cn-hangzhou.aliyuncs.com/zhangliang-yun/zhangliang-docker-repository:[镜像版本号]
```

```c#
local private docker repository...
	1.下载镜像Docker Registry 
		docker pull registry
	2.运行私有库Reeistry，相当于本地有个私有Docker hub
		docker run -d -p 5000:5000 -v /zhangliang/myregistry:/tmp/registry --privileged=true registry
		// 默认情况，仓库被创建在容器的/var/lib/registry 下，建议自行用容器卷映射，方便于宿主机联
	3.CURL 验证私服库上已有的镜像
		curl -XGET http://0.0.0.0:5000/v2/_catalog (可能需要在安全组开放端口: sudo ufw allow 5000)
	4.将新镜像修改符合私服规范的 Tag 
		docker tag lg_ubuntu:1.3.0 0.0.0.0:5000/lg_ubuntu:1.3.0
		// docker tag 镜像:Tag Host:Port/Repository:Tag

	5.推送到私服库
		docker push 0.0.0.0:5000/lg_ubuntu:1.3.0
		//需要 修改配置文件使之支持 http 推送
		sudo vim /etc/docker/daemon.json
		{
			"registry-mirrors": ["https://jgnv1bqb.mirror.aliyuncs.com"],
			"insecure-registries": ["0.0.0.0:5000"]
		}
		sudo docker start ...
	
	6.pull到本地并运行
		docker pull 0.0.0.0:5000/lg_ubuntu:1.3.0
```



### Network

```c#
docker network list
docker inspect xxx

bridge:	为每一个容器分配、设置IP 等，并将容器连接到一个 docker8 虚拟网桥，默认为该模式。
host:	容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的 IP 和端口。
none:	容器有独立的Network namespace，但并没有对其进行任何网络设置，如分配 veth pair 和网桥连接，IP 等。
container:	新创建的容器不会创建自己的网卡和配置自己的IP，而是和一个指定的容器共享IP、端口范围等
    
// 开启虚拟机 ipv4 转发功能 (让容器也能访问外网)
vi /etc/sysctl.conf
 
	net.ipv4.ip_forward = 1

firewall-cmd --add-masquerade --permanent
firewall-cmd --reload
firewall-cmd --query-masquerade

systemctl restart docker
    
// ping 通 Window10(IP:192.168.0.2) --> VMware_Ubuntu(IP:192.168.7.128) --> Docker Container(Bridge IP:172.17.0.2)
ufw disable
systemctl stop firewalld.service

C:\Windows\system32> route add 172.17.0.0 mask 255.255.0.0 192.168.7.128
				(or: route add 172.17.0.0 mask 255.255.255.0 192.168.7.128)
```



### Dockerfile

```c#
CMD
	Dockerfile 中可以有多个 CMD 指令，但只有最后一个生效，CMD 会被 docker run 之后的参数替换

ENTRYPOINT
	类似于 CMD 指令，但是ENTRYPOINT不会被docker run后面的命令覆盖， 而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序

FROM- 镜像从那里来
MAINTAINER- 镜像维护者信息
RUN- 构建镜像执行的命令，每一次RUN都会构建一层
CMD- 容器启动的命令，如果有多个则以最后一个为准，也可以为ENTRYPOINT提供参数
VOLUME- 定义数据卷，如果没有定义则使用默认
USER- 指定后续执行的用户组和用户
WORKDIR- 切换当前执行的工作目录
HEALTHCHECH- 健康检测指令
ARG- 变量属性值，但不在容器内部起作用
EXPOSE- 暴露端口
ENV- 变量属性值，容器内部也会起作用
ADD- 添加文件，如果是压缩文件也解压
COPY- 添加文件，以复制的形式
ENTRYPOINT- 容器进入时执行的命令
```





### DockerCompose

```c#
核心概念
	·一文件
		docker-compose.yml
	·两要素
		·服务（service）
			一个个应用容器实例，比如订单微服务、库存微服务、mysql容器、nginx容器或者redis容器
		·工程（project）
			由一组关联的应用容器组成的一个完整业务单元，在 docker-compose.yml 文件中定义。

使用的三个步骤
· 编写Dockerfile定义各个微服务应用并构建出对应的镜像文件
· 使用 docker-compose.yml 定义一个完整业务单元，安排好整体应用中的各个容器服务。
· 最后，执行docker-compose up命令 来启动并运行整个应用程序，完成一键部署上线

docker-compose -h   	 # 查看帮助
docker-compose up   	 # 启动所有docker-compose服务
docker-compose up -d	 # 启动所有docker-compose服务并后台运行
docker-compose down 	 # 停止并删除容器、网络、卷、镜像。
docker-compose exec  yml 里面的服务id                 # 进入容器实例内部  docker-compose exec docker-compose.yml文件中写的服务id /bin/bash
docker-compose ps  		 # 展示当前docker-compose编排过的运行的所有容器
docker-compose top 		 # 展示当前docker-compose编排过的容器进程
 
docker-compose logs  yml里面的服务id     # 查看容器输出日志
docker-compose config    # 检查配置
docker-compose config -q # 检查配置，有问题才有输出
docker-compose restart   # 重启服务
docker-compose start     # 启动服务
docker-compose stop      # 停止服务
```



### DockerSwarm





### Consul

![](Images\Consul.png)

服务注册发现

Keys: start

```
docker pull consul
docker run -itd -p 8500:8500 --name consulinstance1 consul http://192.168.3.230:8500
docker rm -f consulinstance1
```

Keys: Nuget: Consul

```c#
public static void RegisterConsul(this IConfiguration configuration)
{
	ConsulClient client = new ConsulClient(c =>
	{
		c.Address = new Uri("http://localhost:8500/");
		c.Datacenter = "dc1";
	});

	string ip = string.IsNullOrWhiteSpace(configuration["ip"]) ? "192.168.3.230" : configuration["ip"];
	int port = int.Parse(configuration["port"]);//命令行参数必须传入
	int weight = string.IsNullOrWhiteSpace(configuration["weight"]) ? 1 : int.Parse(configuration["weight"]);

	client.Agent.ServiceRegister(new AgentServiceRegistration()
	{
		ID = "service" + Guid.NewGuid(),//唯一的人---C罗---独一无二
		Name = "ZhaoxiService",//组名称-Group   尤文图斯
		Address = ip,//其实应该写ip地址--身高
		Port = port,//不同实例--体重
		Tags = new string[] { weight.ToString() },//标签
		Check = new AgentServiceCheck()
		{
			Interval = TimeSpan.FromSeconds(12),//间隔12s一次
			HTTP = $"http://{ip}:{port}/Api/Health/Index",
			Timeout = TimeSpan.FromSeconds(5),//检测等待时间
			DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(20)//失败后多久移除
		}
	});
	//命令行参数获取
	Console.WriteLine($"{ip}:{port}--weight:{weight}");
}

public void RequestConsul()
{
	ConsulClient client = new ConsulClient(c =>
	{
		c.Address = new Uri("http://192.168.3.230:8500/");
		c.Datacenter = "dc1";
	});
	var response = client.Agent.Services().Result.Response;
	//有了consul 程序需要知道哪些信息，才能调用服务？---哪一组服务--哪个球队
	string url = null;
	url = "http://ZhaoxiService/api/users/all";//consul提供的是ip+port

	Uri uri = new Uri(url);
	string groupName = uri.Host;
	AgentService agentService = null;

	var serviceDictionary = response.Where(s => s.Value.Service.Equals(groupName, StringComparison.OrdinalIgnoreCase)).ToArray();//找到的全部服务--4个
	{
		agentService = serviceDictionary[0].Value;//直接拿的第一个
		//这里有三个服务或者服务实例，只需要选择一个调用，那么这个选择的方案，就叫 负载均衡策略
	}
	//{
	//    //轮询策略 也是平均，但是太僵硬了
	//    agentService = serviceDictionary[iIndex++ % serviceDictionary.Length].Value;
	//}
	//{
	//    //平均策略--随机获取索引--相对就平均
	//    agentService = serviceDictionary[new Random(iIndex++).Next(0, serviceDictionary.Length)].Value;
	//}
	//{
	//    //权重策略--能给不同的实例分配不同的压力---注册时提供权重
	//    List<KeyValuePair<string, AgentService>> pairsList = new List<KeyValuePair<string, AgentService>>();
	//    foreach (var pair in serviceDictionary)
	//    {
	//        int count = int.Parse(pair.Value.Tags?[0]);//1   5   10
	//        for (int i = 0; i < count; i++)
	//        {
	//            pairsList.Add(pair);
	//        }
	//    }
	//    //16个  
	//    agentService = pairsList.ToArray()[new Random(iIndex++).Next(0, pairsList.Count())].Value;
	//}
	url = $"{uri.Scheme}://{agentService.Address}:{agentService.Port}{uri.PathAndQuery}";
	string content = InvokeApi(url);
	base.ViewBag.Users = Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<User>>(content);
	Console.WriteLine($"This is {url} Invoke");
}

public string InvokeApi(string url)
{
	using (HttpClient httpClient = new HttpClient())
	{
		HttpRequestMessage message = new HttpRequestMessage();
		message.Method = HttpMethod.Get;
		message.RequestUri = new Uri(url);
		var result = httpClient.SendAsync(message).Result;
		string content = result.Content.ReadAsStringAsync().Result;
		return content;
	}
}
```

### Polly

![](Images\Polly.png)

Polly是一种.NET弹性和瞬态故障处理库，允许我们以非常顺畅和线程安全的方式来执诸如行重试，断路，超时，故障恢复等策略。

### Skywalking

![](Images\Skywalking.png)

分布式追踪和APM的Server端，它将包含Collector，Storage，独立的Web UI，并使用Open Tracing规范来设计追踪数据。

### Exceptionless & ELK

![](Images\Exceptionless.png)

Exceptionless：开源的日志收集和分析框架，能为应用程序提供实时错误、特性和日志报告。

![](Images\ELK.png)

ELK：最强的分布式日志解决方案

### Apollo

![](Images\Apollo.png)

配置管理平台，能够集中化管理应用不同环境、不同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性。





