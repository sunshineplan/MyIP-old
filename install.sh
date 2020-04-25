#! /bin/bash

installSoftware() {
    apt -qq -y install python3-flask uwsgi-plugin-python3 nginx
}

installMyIP() {
    mkdir -p /var/log/uwsgi
    curl -Lo- https://github.com/sunshineplan/MyIP/archive/v1.0.tar.gz | tar zxC /var/www
    mv /var/www/MyIP* /var/www/myip
}

setupsystemd() {
    cp -s /var/www/myip/myip.service /etc/systemd/system
    systemctl enable myip
    service myip start
}

writeLogrotateScrip() {
    if [ ! -f '/etc/logrotate.d/uwsgi' ]; then
	cat >/etc/logrotate.d/uwsgi <<-EOF
		/var/log/uwsgi/*.log {
		    copytruncate
		    rotate 12
		    compress
		    delaycompress
		    missingok
		    notifempty
		}
		EOF
    fi
}

setupNGINX() {
    cp -s /var/www/myip/MyIP.conf /etc/nginx/conf.d
    sed -i "s/\$domain/$domain/" /var/www/myip/MyIP.conf
    service nginx reload
}

main() {
    read -p 'Please enter domain:' domain
    installSoftware
    installMyIP
    setupsystemd
    writeLogrotateScrip
    setupNGINX
}

main
