import fs from 'fs'
import process from 'process'

const file = process.argv[2]
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)

// Найти первую некомментную строку (заголовок)
const headerIndex = lines.findIndex((line) => line.trim() && !line.startsWith('#'))
if (headerIndex === -1) {
  process.exit(0)
}

let header = lines[headerIndex]
  .trim()
  .replace(/\.+$/, '') // убрать точки в конце
  .replace(/\s+/g, ' ') // заменить множественные пробелы на один

header = header.charAt(0).toUpperCase() + header.slice(1)

lines[headerIndex] = header

// Перезаписать файл
fs.writeFileSync(file, lines.join('\n'))
