## STC90C516

Keil

![](Images\C51\Keil_Output.png)

### I2C

![](Images\C51\I2C_时序图.png)

## STM32103C8T6

![](Images\STM32\STM32103C8T6.png)

### NRF2401L

![](Images\STM32\NRF2401L 接线图.png)

![](Images\STM32\NRF2401L 配置.png)

## Raspberry

### Start

Keys: rpi-imager

```
https://www.raspberrypi.com/software/
```
### Vim

Keys: install & configure vim

```
dd		删除
yy		复制
p		粘贴
u		撤销	(windows Ctrl z)
Ctrl r	反撤销	(windows Ctrl y)

sudo apt install vim
sudo vi /etc/vim/vimrc
set nu  #显示行号
syntax on  #语法高亮
set tabstop=4  #tab退四格
```

### VsCode Rmote 

Keys: VsCode、SSH、Python

```markdown
1.Visual Stuido Code & FinalShell

2.Windows10 设置开发人员模式,安装 OpenSSH

3.Install Remote - SSH & Remote - SSH: Editing Configuration Files on vs code
  configure ssh path: C:\Windows\System32\OpenSSH\ssh.exe

4.Run powershell cmd on windows: ssh-keygen -t rsa -b 4096
 (tip: C:\Users\lianggan13/.ssh/id_rsa)
 
5.Run cmds on linux:
	ssh-keygen -t rsa -b 4096
	
6.Copy id_rsa.pub from windows to linux

7.Run cmds on linux:
	cat .ssh/id_rsa.pub >> .ssh/authorized_keys
	sudo chmod 777 .ssh/authorized_keys
	sudo chmod 700 -R .ssh

8.sudo vi /etc/ssh/sshd_config
	PermitRootLogin yes
	PubkeyAuthentication yes
	AuthorizedKeysFile .ssh/authorized_keys

9.再次 ssh-keygen -t rsa -b 4096

10.添加 ssh-key to Github

11.git clone git@github.com:lianggan13/RaspberryPi.git
git clone git@github.com:lianggan13/IoT.git
```

Keys: Visual Stuido Code

```
命令盘(Ctrl + Shift + P)中输入: select interpreter
```

Keys: SSH command

```
sudo service sshd restart 
```

### Image

Keys: sourelist --> aliyun (此步骤非必要)

```
sudo vi /etc/apt/sources.list
	deb http://mirrors.aliyun.com/raspbian/raspbian/ bullseye  main non-free contrib rpi
	deb-src http://mirrors.aliyun.com/raspbian/raspbian/ bullseye main non-free contrib rpi

更新软件索引清单
sudo apt-get update

比较索引清单更新依赖关系
sudo apt-get upgrade -y
```



### Static IP

Keys: dhcpcd.conf (方式1)

```py
sudo vi /etc/dhcpcd.conf

interface eth0
static ip_address=192.168.0.7
static routers=192.168.0.1
static domain_name_servers=8.8.8.8
static domain_search=
noipv6

interface wlan0
static ip_address=192.168.2.21/24
static routers=192.168.2.1
static domain_name_servers=114.114.114.114
或者 桌面右上角右击 wireless & Wired Network Setttings

reboot

sudo ifconfig eth0 192.168.1.179
```

Keys: rc.local(方式2)

```
 sudo vi /etc/rc.local
 添加固定IP sudo ifconfig eth0 192.168.1.179
 操作系统启动时 会 自动调用 rc.local 脚本
 
 
```

Keys: 网络配置文件

	sudo vi /etc/network/interfaces
	sudo vi /etc/wpa_supplicant/wpa_supplicant.conf
	sudo vi /etc/dhcpcd.conf



### AP(Access Point)

```
[配置树莓派为wifi热点（AP模式） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/265614241)

还需要检查下 hostapd服务是否启动了，重新启动下：
$ sudo systemctl restart hostapd
Failed to restart hostapd.service: Unit hostapd.service is masked.

如上所示，service 被 masked，则需要 unmask 并启动服务：
$ sudo systemctl unmask hostapd
$ sudo systemctl enable hostapd
$ sudo systemctl start hostapd


设置开机时自动执行该命令
$ sudo vi /etc/rc.local
	在 exit 0 之前添加你要执行的命令
	sudo systemctl restart hostapd
$ sudo chmod +x /etc/rc.local

```



Ref link: https://raspberrypi-guide.github.io/networking/create-wireless-access-point

```
1.Getting started
sudo apt install dnsmasq hostapd
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd

2.Configure a static IP
sudo vi /etc/dhcpcd.conf
    interface wlan0
        static ip_address=192.168.4.1/24
        nohook wpa_supplicant
sudo service dhcpcd restart

3.Configure the DHCP server
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
sudo vi /etc/dnsmasq.conf
    interface=wlan0
    dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
sudo systemctl start dnsmasq   

5.Configure the access point host software
sudo vi /etc/hostapd/hostapd.conf
    interface=wlan0
    driver=nl80211
    ssid=raspberry
    hw_mode=g
    channel=6
    ieee80211n=1
    wmm_enabled=1
    ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]
    macaddr_acl=0
    auth_algs=1
    ignore_broadcast_ssid=0
    wpa=2
    wpa_key_mgmt=WPA-PSK
    wpa_passphrase=raspberry
    rsn_pairwise=CCMP

sudo vi /etc/default/hostapd
	DAEMON_CONF="/etc/hostapd/hostapd.conf"

6.Start up the wireless access point
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd

7.Enable routing and IP masquerading
sudo vi /etc/sysctl.conf
	net.ipv4.ip_forward=1
sudo iptables -t nat -A  POSTROUTING -o eth0 -j MASQUERADE
sudo apt-get install netfilter-persistent
sudo netfilter-persistent save

8.Stop the access point
sudo systemctl stop hostapd
sudo vi /etc/dhcpcd.conf
    #interface wlan0
    #    static ip_address=192.168.4.1/24
    #    nohook wpa_supplicant
sudo reboot

```

### Samba

```
sudo apt-get install samba samba-common-bin

sudo vi /etc/samba/smb.conf
    #======================= Share Definitions =======================

    [homes]
       comment = /home/pi
       browseable = yes

    # By default, the home directories are exported read-only. Change the
    # next parameter to 'no' if you want to be able to write to them.
       read only = no

    # File creation mask is set to 0700 for security reasons. If you want to
    # create files with group=rw permissions, set next parameter to 0775.
       create mask = 0777

    # Directory creation mask is set to 0700 for security reasons. If you want to
    # create dirs. with group=rw permissions, set next parameter to 0775.
       directory mask = 0777

sudo /etc/init.d/smbd restart
sudo /etc/init.d/samba-ad-dc restart

sudo smbpasswd -a pi

win10
控制面板 >> 程序
	启动或关闭Windows功能
			>> SMB1.0/CIFS文件共享支持和SMB直通
	
Win+R >> regedit
	\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters
		>> AllowInsecureGuestAuth = 1

```

### Route

Keys: route.sh

```
#!/bin/bash

# add route for wlan0

echo "sudo route add  default gw 192.168.1.1 dev wlan0 metric 99"
sudo route add  default gw 192.168.1.1 dev wlan0 metric 99

echo "sudo route add  default gw 192.168.10.1 dev wlan0 metric 99"
sudo route add  default gw 192.168.10.1 dev wlan0 metric 99
```

Keys: profile.d

```
# cp and autostart
sudo cp route.sh /etc/profile.d/
```

https://github.com/Python-IoT/Smart-IoT-Planting-System

### Boot

Keys: sudo vi /boot/config.txt 

```
# uncomment to force a console size. By default it will be display's size minus
# overscan.
framebuffer_width=1920
framebuffer_height=1080

# uncomment if hdmi display is not detected and composite is being output
hdmi_force_hotplug=1
```


### MQTT

Keys: paho-mqtt

```cmake
The MQTT Broker is the Server.
The MQTT Subscribers and Publishers are the Clients.

pip3 install paho-mqtt
```

Keys: mosquitto

```
sudo apt install mosquitto mosquitto-clients
sudo systemctl status mosquitto
mosquitto -v
sudo lsof -i:1883

mosquitto_sub -h localhost -t "mqtt/pimylifeup"
mosquitto_pub -h localhost -t "mqtt/pimylifeup" -m "Hello world"

mosquitto_passwd -c /etc/mosquitto/passwd gtwang
/etc/mosquitto/mosquitto.conf
    # 設定帳號密碼檔案
    password_file /etc/mosquitto/passwd
    # 禁止匿名登入
    allow_anonymous false
service mosquitto restart
mosquitto_sub -t gtwang/test -u gtwang -P secret123
mosquitto_pub -t gtwang/test -u gtwang -P secret123 -m "Hello, world!"


https://blog.csdn.net/lordwish/article/details/85006228
```

Key: hbmqtt

```
pip install "websockets==8.1"
pip install hbmqtt
hbmqtt
hbmqtt_sub --url mqtt://192.168.1.189:1883 -t /gateway
hbmqtt_pub --url mqtt://192.168.1.189:1883 -t /gateway -m Hi,gateway!
sub.py 


WARNING: The scripts hbmqtt, hbmqtt_pub and hbmqtt_sub are installed in '/home/pi/.local/bin' which is not on PATH.
Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
  
export PATH="~/.local/bin:$PATH"
echo $PATH
sudo vim /etc/profile
echo $PATH

Python 3.9.2 (default, Mar 12 2021, 04:06:34) 

https://github.com/beerfactory/hbmqtt.git
```

Key: amqtt

```
pip install amqtt

amqtt_sub --url mqtt://192.168.1.189:1883 -t /gateway
amqtt_pub --url mqtt://192.168.1.189:1883 -t /gateway -m Hi,gateway!


amqtt_sub --url mqtt://0.0.0.0:1883 -t /gateway
amqtt_pub --url mqtt://0.0.0.0:1883 -t /gateway -m Hi,gatew
```

### Python

Keys: Download &  Compile

```
$ sudo apt-get update
$ sudo apt-get upgrade -y

$ sudo apt-get install build-essential libsqlite3-dev sqlite3 bzip2 libbz2-dev

$ wget https://www.python.org/ftp/python/3.6.12/Python-3.6.12.tgz
$ tar zxvf Python-3.6.12.tgz
$ cd Python-3.6.12

$ sudo ./configure && sudo make && sudo make install
```

Keys: Soft links

```
$ python --version
Python 3.9.2

$ python3 --version
Python 3.6.12

$ which python
/usr/bin/python
$ which python3
/usr/local/bin/python3

$ sudo mv /usr/bin/python /usr/bin/python3.9.2
$ sudo ln -s /usr/local/bin/python3 /usr/bin/python

$ python --version
Python 3.6.12


$ which pip
/usr/bin/pip
$ which pip3
/usr/local/bin/pip3

$ sudo mv /usr/bin/pip  /usr/bin/pip3.9.2
$ sudo ln -s /usr/local/bin/pip3 /usr/bin/pip

$ pip --version
pip 18.1 from /usr/local/lib/python3.6/site-packages/pip (python 3.6)
```

Keys: Remove | Uninstall

```
$ sudo apt remove <Package>
$ sudo apt autoremove
```

Keys: Pi.GPIO、spidev

```
sudo apt-get install python3-dev

sudo apt-get install python3-rpi.gpio

sudo apt-get install python3-smbus

sudo apt-get install python3-serial

安装spidev库，SPI接口库函数

tar -xvf Spidev-3.1.tar.gz
sudo python setup.py install
```





### TCP/IP

```
http://www.python-exemplary.com/index_en.php?inhalt_links=navigation_en.inc.php&inhalt_mitte=raspi/en/communication.inc.php
```



### GPIO

```
sudo raspi-gpio get

```

### PiCamera

```
sudo apt-get update
sudo apt-get install python3-picamera
```




### Install

```
# 安装包与软件
sudo apt install <package>
# 删除软件及其配置文件
apt-get --purge remove <package>
# 删除没用的依赖包
apt-get autoremove


pip install
pip uninstall

```

## TPYBoardV102

### 引脚图

<img src=".\Images\TPYBoardV102\引脚图.png" style="zoom:200%;" />



```

102资料下载
http://www.tpyboard.com/download/data/182.html

TPYBoard v102 micropython Python开发板 pyboard STM32F405

http://www.tpyboard.com/pythoneditor/

http://docs.tpyboard.com/zh/latest/

REPL
Putty
>>> help()
>>> help(pyb.LED)

Ctrl + D 软重启

出厂模式：按住usr键，按一下rst，然后led2和led3交替亮，当两个灯交替亮到三次，且均亮起时，松开usr
USB－HID模式：编辑 boot.py 文件，去掉了pyb.usb_mode('CDC+HID')前的注释符
安全模式：Usr + RST 按一下 等LED3 亮 松开 Usr



```

Keys: VSCode、Pymakr、Micropython IDE

```
Pymakr 
pymakr.json

{
	"address": "COM3",
	"username": "micro",
	"password": "python",
	"sync_folder": "/",
	"open_on_start": false,
	"sync_file_types": "py,txt,log,json,xml,html,js,css,mpy",
	"ctrl_c_on_connect": false,
	"safe_boot_on_upload": false,
	"py_ignore": [
		"pymakr.conf",
		".vscode",
		".gitignore",
		".git",
		"project.pymakr",
		"env",
		"venv"
	],
	"fast_upload": false,
	"sync_all_file_types": false,
	"auto_connect": true,
	"autoconnect_comport_manufacturers": [
		"Pycom",
		"Pycom Ltd.",
		"FTDI",
		"Microsoft",
		"Microchip Technology, Inc.",
		"1a86"
	]
}

Micropython IDE
```



### Serial

```
ref links:
https://www.waveshare.net/study/article-606-1.html

https://chinacqzgp.blog.csdn.net/article/details/116663317?spm=1001.2101.3001.6661.1&depth_1-utm_relevant_index=1

ref link:
https://blog.csdn.net/ShenZhen_zixian/article/details/119531639

如果同时打开了端口和shell打印，就只能用于shell调试，不能当普通串口使用，不然会导致串口数据传输不稳定，偶尔出现乱码

sudo apt-get install minicom

sudo vim /boot/config.txt
在最后一行添加 dtoverlay=pi3-miniuart-bt
sudo minicom -D /dev/ttyAMA0 -b115200

USB转TTL的模块

sudo apt-get install minicom

1：输入crtl+A，再输入E，可以打开串口发送显示（默认是关闭显示的），再操作一遍则是隐藏显示。
2：输入crtl+A，再输入Q，Enter，可以退出minicom窗口。

#!/usr/bin/python
# -*- coding:utf-8 -*-
import serial

#ser = serial.Serial("/dev/ttyAMA0",115200)
ser = serial.Serial("/dev/ttyS0",115200)

print("serial test start ...")
ser.write("Hello Wrold !!!\n")
try:
    while True:
        ser.write(ser.read())
except KeyboardInterrupt:
    if ser != None:
        ser.close()


sudo usermod -aG　dialout pi
```

### ESP8266

[ESP8266 调试教程一（STA模式）（详细图文） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/164115983)

```
测试连通性
AT 
```

Keys: STA 模式

```
查看当前模式
AT+CWMODE? 
设置当前为 STA 模式
AT+CWMODE=1
查看 当前可以查询到的 Wifi 列表
AT+CWLAP
连接 Wifi 模式下的参数：WIFI 名称，密码
AT+CWJAP="LG_ESP","G15608212470*"

查看被 分配的 ip
AT+CIFSR

断开 Wifi
AT+CWQAP

连接 TCP 服务器
AT+CIPSTART="TCP","192.168.1.1",8989

使能数据的透传模式
AT+CIPMODE=1

发送数据
AT+CIPSEND

退出数据传输(不能带回车换行符,串口调试助手上的回车换行 √ 去掉)
+++

关闭透传模式
AT+CIPMODE=0

关闭 TCP 连接
AT+CIPCLOSE
```

Keys: AP 模式

```
查看当前模式
AT+CWMODE? 
设置当前为 AP 模式
AT+CWMODE=2 
查看 AP 模式下的参数
AT+CWSAP? 
设置 AP 模式下的参数：WIFI 名称，密码，通道号，加密方式，允许接入 Station 个数(0~8)
AT+CWSAP="LG_ESP","G15608212470*",1,3,4

使能多连接模式
AT+CIPMUX=1
创建 TCP 服务器，默认端口为 333
AT+CIPSERVER=1

查看 ESP8266 创建 TCP 服务器时的 IP
AT+CIPAP?
向客户端发送数据
先发送指令：AT+CIPSEND=ID,数据长度
再发送数据
```

### NFR24L01 2.4G 无线模块

<img src=".\Images\TPYBoardV102\NRF24L01_01.png" style="zoom:50%;" />

<img src=".\Images\TPYBoardV102\NRF24L01_02.png" />

```json
1 GND ------>> 接地(与单片机共地)
2 VCC ------>> 1.9~3.6V (推荐3.3V)
3 CE ------>> RX 或 TX模式选择 高电平>10us则为发送模式 持续高电平为接收模式
设为低电平是待机模式
4 CSN ------>> SPI片选信号 低电平使能，默认状态应该设置为高，以免发生错误的数据传输
5 SCK ------>> SPI时钟信号
6 MOSI ------>> 从SPI数据输入脚 (这里解释一下MOSI对应的单片机引脚输出信号， 即单片机输出数据给nRF24L01)
7 MISO ------>> 从SPI数据输出脚 （MISO对应单片机引脚设置为输入， 即数据从nRF24L01出来送进单片机 ）

http://bbs.eeworld.com.cn/thread-644156-1-1.html
https://blog.csdn.net/Kevin_8_Lee/article/details/95667604

NRF24L01	
VCC		CSN		MOSI	IRQ

GND		CE		SCK		MISO

-----------------------------
STM32F10X

VCC		10		15(PC6)	15?

GND		5(PC5)	13		14(PC7)

红	    灰	   橙	   -

黑	    土	   黄	   橙

-----------------------------
TPYBoardv10x

VCC		X5		X8		-

GND		X4		X6		X7


VCC		Y5		Y8		-

GND		Y4		Y6		X7

红	    灰	   橙	   -

黑	    土	   黄	   橙



```

> USB 串口指令

```
无线接收本机地址
AT+RXA=0xFF,0xFF,0xFF,0xFF,0xFF

无线发送目标地址
AT+TXA=0xFF,0xFF,0xFF,0xFF,0xFF

无线通讯信道设置
AT+FREQ=2.xxxxG
信道 2.xxx为要设定的频率,范围是2.400CHz~2.525GHz,超过范围无效。

参数信息查询
AT?
```



底层时序图

## 

## Github

Smart-IoT-Planting-System

Pioneer600
	使用教程 https://www.waveshare.net/wiki/Pioneer600
	RPI使用教程：提供BCM2835、WiringPi、文件IO、RPI（Python）库例程

https://blog.csdn.net/weixin_37988176/article/details/109423815