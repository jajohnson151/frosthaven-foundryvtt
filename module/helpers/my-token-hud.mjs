export class MyTokenHUD extends TokenHUD {
    getData(options) {
        let data = super.getData(options);
        console.log(data)
        return data;
    }

}
