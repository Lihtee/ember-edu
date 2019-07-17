import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        selectAuthor(author){
            console.log(author);
        }
    }
});
