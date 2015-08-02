function log(txt, txt2) {
    if(txt2 == null) {
        console.log(txt )
    } else {
        console.log(txt + " : "+txt2);
    }
}
module.exports=log;