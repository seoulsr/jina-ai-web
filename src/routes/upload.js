const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router()
const axios = require('axios')
const http = require('http')

// Image Upload
const imageStorage = multer.diskStorage({
    destination: 'images', // Destination to store image 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000   // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

// For Single image upload
router.post('/uploadImage', imageUpload.single('image'), (req, response) => {
    const payload = {
        execEndpoint: '/foo',
        data: [{
            id: req.file.filename,
            parent_id: null,
            granularity: null,
            adjacency: null,
            blob: null,
            tensor: null,
            mime_type: null,
            text: null,
            weight: null,
            // uri: req.file.path,
            uri: 'images/2.jpg',
            tags: null,
            offset: null,
            location: null,
            embedding: null,
            modality: null,
            evaluations: null,
            scores: null,
            chunks: null,
            matches: null
        }]
    }
    // const url = 'https://eo655hjbigj51z7.m.pipedream.net'
    const url = 'http://172.30.235.106:45680/search'
    console.log(payload)
    let messageResponse = []
    axios
        .post(url, payload)
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res)
            console.log(res.data.data[0].tags.video_uri)
            console.log(res.data.data[0].tags.timestamp)
            res.data.data.forEach(data => {
                let msg = {
                    video_uri: data.tags.video_uri,
                    timestamp_at_second: data.tags.timestamp
                }
                messageResponse.push(msg);
            })
            response.send(messageResponse);
        })
        .catch(error => {
            // console.error(error)
        })
    // res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// For Multiple image uplaod
router.post('/uploadBulkImage', imageUpload.array('images', 4), (req, res) => {
    res.send(req.files)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// ---------------------------------------------------------------------------- //

// Video Upload
const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 10000000   // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {     // upload only mp4 and mkv format
            return cb(new Error('Please upload a Video'))
        }
        cb(undefined, true)
    }
})

router.post('/uploadVideo', videoUpload.single('video'), (req, response) => {
    const payload = {
        execEndpoint: '/foo',
        data: [{
            id: req.file.filename,
            parent_id: null,
            granularity: null,
            adjacency: null,
            blob: null,
            tensor: null,
            mime_type: null,
            text: null,
            weight: null,
            // uri: req.file.path,
            uri: '/workspace/videos/t2.mp4',
            tags: null,
            offset: null,
            location: null,
            embedding: null,
            modality: null,
            evaluations: null,
            scores: null,
            chunks: null,
            matches: null
        }]
    }
    // const url = 'https://eo655hjbigj51z7.m.pipedream.net'
    const url = 'http://172.30.235.106:45680/index'
    console.log(payload)
    let messageResponse = '';
    axios
        .post(url, payload)
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            // res.send(res.data.data.text)
            console.log('res', res)
            console.log('res.data', res.data)
            console.log('res.data.data', res.data.data)
            messageResponse = res.data.data[0].text
            console.log(messageResponse)
            response.send(messageResponse)
        })
        .catch(error => {
            console.error(error.message)
        })
    
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router
