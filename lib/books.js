import fs from 'fs'
import path from 'path'

// Where the books are located
const booksDirectory = path.join(process.cwd(), 'data/books')

export function getSortedBooksData() {
  // Get file names under /books
  const fileNames = fs.readdirSync(booksDirectory)

  const allBooksData = fileNames.map(fileName => {
    // Remove ".json" from file name to get id and make it a number
    const id = Number(fileName.replace(/\.json$/, ''))

    // Read JSON file as string
    const fullPath = path.join(booksDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Convert the string into a POJO
    const jsonResult = JSON.parse(fileContents)

    // Combine the data with the id
    return { id, ...jsonResult }
  })

  // Sort books by id
  return allBooksData.sort(({ id: a }, { id: b }) => {
    if (a < b) return 1
    if (a > b) return -1
    return 0
  })
}