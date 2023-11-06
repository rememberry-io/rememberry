import fetch from 'node-fetch'

export async function uploadFile(storageZoneName:string, path:string, fileName:string){
    const url = `https://storage.bunnycdn.com/${storageZoneName}/${path}/${fileName}`
    const options = {
        method: 'PUT',
        headers: { accesskey: '3d30834c-5708-45f1-9d33244f9429-331b-499c', 'Content-Type': 'application/octet-stream' }
    }
    const response = await fetch(url, options)
    console.log(response);
    return response
}

export async function downloadFile(storageZoneName:string, path:string, fileName:string) {
    const url = `https://storage.bunnycdn.com/${storageZoneName}/${path}/${fileName}`
    const options = {method:'GET', headers: { accesskey: '3d30834c-5708-45f1-9d33244f9429-331b-499c' } }
    const response = await fetch(url, options)
    console.log(response);
    return response    
}

downloadFile('rememberry-storage-zone', 'testusername', 'image2')

