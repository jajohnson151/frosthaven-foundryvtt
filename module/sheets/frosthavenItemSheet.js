export default class frosthavenItemSheet extends ItemSheet {
    // template - return path to an HTML file
    get template() {
        //alert("A messge from Scoobs");
        console.log(this);
        return 'systems/frosthaven/module/sheets/' + 'basicItem' + '-sheet.html';
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.frosthaven;

        return data;
    }
}