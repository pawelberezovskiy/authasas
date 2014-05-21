TestProject README
==================

Getting Started
---------------

- cd <directory containing this file>

- $VENV/bin/python setup.py develop

- $VENV/bin/initialize_TestProject_db development.ini

- $VENV/bin/pserve development.ini

- setup nginx or apache proxy

example:
    server {
       listen 80;

       location / {
                client_max_body_size 2048m;
                proxy_pass_header Server;
                proxy_set_header Host $http_host;
                proxy_redirect off;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Scheme $scheme;
                proxy_connect_timeout 30;
                proxy_read_timeout 30;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_pass http://127.0.0.1:8081;
                expires off;


          }
    }
