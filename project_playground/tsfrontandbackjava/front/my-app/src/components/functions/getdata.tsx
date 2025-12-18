
export async function getData() {
try {
const response = await fetch('http://localhost:8080/hello?name=Frontend');
const data = await response.json();
return data
} catch (e) {
    console.log(e)

}
}
