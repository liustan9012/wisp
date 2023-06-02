
export function timeConverter(timestamp) {
  const d = new Date(timestamp * 1000);
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2,'0')
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  const sec = d.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}
