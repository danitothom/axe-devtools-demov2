Configurar Api Secrets + .env

Comandes:

npm login --registry=https://agora.dequecloud.com/artifactory/api/npm/npm/ --auth-type=web

npm install 

npm install node 18

npm install <PACKAGE_NAME> --registry https://agora.dequecloud.com/artifactory/api/npm/npm/

instalar chromium v138 (package.json) Ja esta modificat per utilitzar chromium.
Bajar Chromium: https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac_Arm/1389998/
Descomprimir i moure a /Applications/Chromium
Ejecutar:
 sudo xattr -rd com.apple.quarantine Chromium.appsudo spctl --add --label "Chromium" Chromium.app

npm run cypress:watcher (Test amb Cypress en mode watch)