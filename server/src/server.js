import express from 'express';


const app = express();
const PORT = process.env.PORT || 3003;


app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the server!',
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})