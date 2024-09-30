cd ../laf

call laf user add xioobu -r https://[host]
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

echo "set web hosting"
call laf website create [appid]-admin

echo "push cloud function"
call laf func push

echo "init app"
call laf func exec __init__

echo "complete"
