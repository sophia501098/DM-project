/*
 * @Author: Yang Rui
 * @Date: 2020-12-29 17:36:00
 * @LastEditTime: 2021-01-03 15:09:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /DM-project/server.js
 */
const http = require("http");
const app = http.createServer();
const fs= require("fs");
const { Midi } = require('@tonejs/midi');
const { midiToWav } = require("synth-js");
const Lame = require("node-lame").Lame;
app.on("request",(req,res)=>{
    if(req.method=="POST"){
        var data  = [];
    req.on("data",(chunk)=>{
        data.push(chunk)
    })
    req.on("end",()=>{
        var buffer = Buffer.concat(data);
        fs.writeFile("./static/music/sample.midi",buffer,(err)=>{
            if(!err){
                //midi to json
                const midiData = fs.readFileSync("./static/music/sample.midi");
                const midi = new Midi(midiData);
                fs.writeFileSync("./static/midi-sample.json", Buffer(JSON.stringify(midi)));
                console.log('ok: midi to json')
                //midi to wav
                const wavBuffer = midiToWav(midiData).toBuffer();
                fs.writeFileSync('./static/music/sample.wav', wavBuffer, {encoding: 'binary'});
                console.log('ok: midi to wav')
                //wav to mp3
                const encoder = new Lame({
                    output: "./static/music/my_music.mp3",
                    bitrate: 192
                }).setFile("./static/music/sample.wav");
                encoder
                    .encode()
                    .then(() => {
                        // Encoding finished
                        console.log("ok: wav to mp3")
                    })
                    .catch(error => {
                        throw error
                    });
                res.end("success");
            }
        })
    })
    }
})
app.listen(3000,()=>{
    console.log("ok");
})