cd ../laf

laf user add xioobu -r https://[host]
laf user switch xioobu

echo "laf login"
laf login [pat]

echo "app init"
laf app init [appid]

echo "app create admin"
laf storage create admin -p readonly
echo "app create public"
laf storage create public -p readonly
echo "app push web"
laf storage push [appid]-admin ../web

echo "设置 Web 托管"
laf website create [appid]-admin

echo "推送云函数"
laf func push

echo "初始化 app"
laf func exec __init__

echo "完成"
