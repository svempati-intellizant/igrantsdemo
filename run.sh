cd risk_api
docker compose up -d
cd -
cd api/igrant_docker/
docker compose up -d
cd -
cd ui
docker compose up --build
sudo chmod -R 777 /var/www/html/
mkdir /var/www/html/igrant
cp -r new_build/build/* /var/www/html/
cp -r new_build/build/* /var/www/html/igrant
sudo chmod -R 777 /var/www/html/
sudo cp -r default /etc/nginx/sites-available/
sudo nginx -s reload
cd -
cd mongo-dump/igrant/
#this will dump the database backup to mongodb
docker exec -i igrant_mongo /usr/bin/mongorestore  --uri "mongodb://admin:rap12345@localhost:27017/igrant?authSource=admin" --db igrant
