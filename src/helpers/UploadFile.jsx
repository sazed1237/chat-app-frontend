const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append("upload_preset", "chat-app")

    const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: 'post',
        body: formData
    })

    const data = await response.json()

    return data
}


export default uploadFile