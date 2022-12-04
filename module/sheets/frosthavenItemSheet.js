export class frosthavenItemSheet extends ItemSheet {
    // template - return path to an HTML file
    get template() {
        //alert("A messge from Scoobs");
        console.log('frosthavenItemSheet.template(): ENTER');
        //console.log(this);
        return 'systems/frosthaven/module/sheets/' + 'basicItem' + '-sheet.html';
    }

    async getData() {
        console.log('frosthavenItemSheet.getData(): ENTER');
        const context = super.getData();
        //console.log(this);

        //context.config = CONFIG.frosthaven;

        // Use a safe clone of the item data for further operations.
        const itemData = context.item;

       // Add the actor's data to context.data for easier access, as well as flags.
        context.data = itemData.system;
        context.flags = itemData.flags;

        console.log('frosthavenItemSheet.getData(): EXIT');

        return context;
    }
}