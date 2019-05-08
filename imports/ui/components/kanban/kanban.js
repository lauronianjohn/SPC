import './kanban.html'

Template.Kanban.onRendered(function(){
    dragula([
        document.querySelector('#issues'), 
        document.querySelector('#analyzed'),
        document.querySelector('#action'),
        document.querySelector('#cleared')
    ]);
  });