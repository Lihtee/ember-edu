import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        deleteAuthor(author){
            author.destroyRecord().then(() => {
                // Similar to link-to component.
                this.transitionToRoute('author.index');
            });
        }
    }
});
