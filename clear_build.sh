rm tsconfig.tsbuildinfo
find . -name "*.js.map" -not -path "./node_modules/*" | xargs rm
find . -name "*.d.ts" -not -path "./node_modules/*" | xargs rm
find . -name "*.js" -not -name "jest.config.js" -not -path "./node_modules/*" -not -path "./index.js" | xargs rm

