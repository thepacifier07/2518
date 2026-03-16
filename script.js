// This function handles the "automatic" fetching
async function getSubjectData(classId, subjectId) {
    // Dynamically construct the URL
    const url = `./data/${classId}/${subjectId}.json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('File not found');
        
        const data = await response.json();
        displayData(data);
    } catch (err) {
        console.error("Could not find the JSON file:", err.message);
        // Fallback if the file hasn't been created yet
        document.getElementById('content').innerHTML = "Chapter data coming soon!";
    }
}
