It is required to run the web interface over the HTTP protocol.

Choose any of the following methods:

Python 3.x
----------

```
$ python -m http.server 8000
```

Python 2.x
----------

```
$ python -m SimpleHTTPServer 8000
```

Ruby
----

```
ruby -run -ehttpd . -p8000
```

Docker
------

```
docker run -d -p 8080:80 --name my-apache-app -v "$PWD":/usr/local/apache2/htdocs/ httpd:2.4-alpine
```

.. or use this list: https://gist.github.com/willurd/5720255
