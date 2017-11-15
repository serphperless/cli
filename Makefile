build:
	npx webpack
	chmod +x dist/serphperless.js

publish: build
	npm publish
