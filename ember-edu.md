## Day 1
___
1. Install npm + node.
2. cmd: npm install -g ember cli
3. cmd: ember new <app-name>
4. cmd: ember serve
5. Install dotnet core sdk.
6. cmd: dotnet new webapi
7. cmd: dotnet run // similar to start without debugging: change code => shutdown => rebuild => launch
8. cmd: dotnet add package Microsoft.Dotnet.Watcher.Tools
9. cmd: dotnet run watcher // track changes and automaticaly apply them to running server.

## Day 2
___
postgres: 
+ port 5432; 
+ credendials admin, 1;
+ winuser NT AUTHORITY\NetworkService;
+ senvicename: postgresql-11;

ember-ui:
+ templates
  + {{outlet}} - specific page. Outside this - general wrapper, which is present in any other page on current route.
  + model usage and iterating:  
  ```hbs
    {{#each model as |author|}}
        <li>
            <a href>
                {{author.first}} {{author.last}}
            </a>
        </li>
    {{/each}}
  ```
+ routes: 
  + router.js - route map.
  + route model: 
  ```js
  export default Route.extend({
    model(){
        return [{
            first: 'J.K.',
            last: 'Rowling'
        },
        {
            first: 'Tom',
            last: 'Clancy'
        }
        ];
    }
    });
  ```
+ Some styles.

Dotnet core api:
+ Controller - just defined with configured services and works: 
```csharp
public class AuthorsController : JsonApiController<Author>
    {
        public AuthorsController(
            IJsonApiContext jsonApiContext,
            IResourceService<Author> resourceService,
            ILoggerFactory loggerFactory
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {}
    }
```
+ Migrations - tracking Model changes and storing them in Migrations folder as C# code. 
  + add migration: 
  ```ps
  cmd: dotnet ef migrations add AddAuthor
  ```
  + update database based on migrations:
  ```ps
  cmd: dotnet ef database update
  ```
+ DbContext - configuring db connection and adding DbSet<T>, which is a set of entities T that context stores and provides.
+ Stratup.cs - configuring services.

## Day 3.

+ Ember models. Allows to use ember js api.
    + .
    ```js
    import DS from 'ember-data';
    const { Model, attr } = DS;

    export default Model.extend({
        first: attr(),
        last: attr()
    });
    ```  
    + If this is for authors, we can iterate model via each:
    ```js
    {{#each model as |author|}}
        <li>
            <a href>
                {{author.first}} {{author.last}}
            </a>
        </li>
    {{/each}}
    ```
    + We can use such model to gain data in route:
    ```js
    export default Route.extend({
    model(){
        return this.store.findAll('author')
    }});
    ```
    Important to write model name in singular form.
    + cmd: ember g model name prop1 prop2 ...
+ Routes customization. 
    + We can set up custom url for each route via path.
    + Can add nested route as a function-parameters to parent route.
        + We must use ```{{outlet}}``` in parent route to tell ember where to render nested route content.
    + We can set a dynamical parameter ('/:id') - it is going to be a parameter for the route.
    ```js
    Router.map(function() {
        this.route('author', {path: '/authors'}, function() {
            this.route('detail', { path: '/:id' });
        });
    });
    ```
    + cmd: ember g route parrent/nested 
+ Adapters. Allows to customize where ember js api will be sending requests. By default it sends requests to base web server url.
    ```js
    export default DS.JSONAPIAdapter.extend({
        host: 'http://localhost:3000'
    });
    ```
    + cmd: ember g component name

+ Components.
    + cmd : ember g component name 
    + app/component/some-component.js - logic.
    + app/templates/components/some-component.hbs - view.
    + Does not need any namespace or path specified.
    + Can take params (first, last) and access them in content.
    + Can be easily putted inside tag via tagName.
    ```js
    {{author-list-item first=author.first last=author.last tagName="li"}}
    ```

## Day 4

+ link-to component
    + Linked to route.
    + Does not refresh the page on click.
    + Nested routes are specifying via dot(not slash).
    + To pass a parameter in dynamic route (detail) we need to pass it right after route.
    + Content can be putted inside this component as same as usual html tag.
    ```js
    {{#link-to "author.detail" authorId}}
        <strong>{{last}}</strong>, {{first}} 
    {{/link-to}}
    ```
+ Ember data
    + store.findRecord('modelName', id) - find single record and return one object according to model.
+ Actions.
    + Defined in controller:
    ```js
    actions: {
        deleteAuthor(author){
            console.log(author);

            window.alert('Delete Author');
        }
    }
    ```
    + Used as follow:
    ```html
    <button class="btn-recessed" onclick={{action "deleteAuthor" model}}>delete</button>
    ```
    action + action-name + param
+ Deleting object
    + Definition:
    ```js
    deleteAuthor(author){
        author.destroyRecord().then(() => {
            // Similar to link-to component.
            this.transitionToRoute('author.index');
        });
    }
    ```
    + modelObject.destroyRecord - calls modelObject.deleteRecord() (which marks object as deleted and not sending anything to server),
    and then calls modelObject.save() to send deleting request.
    + transitionToRoute - similar to link-to component transition to another route without refreshing a page.
+ Creating and updating object.
    + Updating value in ember data (without saving):
    ```js
    actions: {
        changeFirst(value){
            this.set('first', value);
        }
    }
    ```
    + 3 ways of input data.
        + via event and action:
        ```html
        <div class="field">
            <label>First Name: {{first}}</label>
            <input 
            type="text" 
            value="{{first}}"
            placeholder="First Name" 
            oninput={{action "changeFirst" value="target.value"}}
            >
        </div>
        ```
        Param value="target.value" calls the DOM object properties target.value.
        DOM object here - oninput event.
        + Via mut helper. We dont need to specify an action name with this helper.
        ```html
        <div class="field">
            <label>Last Name: {{last}}</label>
            <input 
            type="text" 
            value="{{last}}"
            placeholder="Last Name" 
            oninput={{action (mut last) value="target.value"}}>
        </div>
        ```
        + Via special input element. Two-way data binding.
        ```html
        <div class="field">
            <label>Last Name: {{last}}</label>
            {{input 
            type="text" 
            placeholder="Last Name" 
            value=last 
            }}
        </div>
        ```
## Day 5. 
+ Clearing data on route start.
    + Reset single param via base method: 
    ```js
        resetController(controller){
        this._super(...arguments);

        controller.set('first', '');
        controller.set('last', '');
    }
    ```
    + Reset multiple params via custom method:
     ```js
        reset(){
        this.setProperties({
            first: '',
            last: ''
        });
    },
    ```
    + Reset by passing an empty model as controller method: 
    ```js
     model(){
        return {
            first: '',
            last: '',
        };
    }
    ```
+ Saving new object in onsasve event:
    ```js
        saveAuthor(ev){
            ev.preventDefault();

            let author = this.store.createRecord('author', this.model);

            author.save()
            .then(() => {
                this.transitionToRoute('author');
            });
        }
    ```
    
