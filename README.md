# Backend of RECLAB

## 导出和恢复一个 DB

```bash
cd mongoData

mongodump -v --db=doubanBook --gzip --archive=doubanBook.agz

mongorestore --db=doubanBook --gzip --archive=doubanBook.agz
```