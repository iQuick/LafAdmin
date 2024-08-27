cd ../laf

call laf user add xioobu -r https://laf.xioobu.cn
call laf user switch xioobu

echo "laf login"
call laf login [pat]

echo "app init"
call laf app init [appid]

echo "app create admin"
call laf storage create admin -p readonly
echo "app create public"
call laf storage create public -p readonly
echo "app push web"
call laf storage push [appid]-admin ../web

echo "设置 Web 托管"
call laf website create [appid]-admin

echo "推送云函数"
call laf func push

echo "初始化 app"
call laf func exec __init__

echo "完成"
