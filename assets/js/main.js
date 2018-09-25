$(document).ready(function () {
  const scroll = () => $('#todos_container').scrollTop($('#todos_container')[0].scrollHeight);

  const createTodo = () => {
    let task = $('#todo_input').val();
    if (task) {
      $.post("/create-todo", {
        task: task
      }, function (response) {
        if (response.success) {
          console.log('result ', response.todo);

          $('#todos_container').append(`
          <div id="${response.todo.id}" class="todo-container ${response.todo.complete ? 'checked' : ''}">
              <div class="remove">
                <span class="ion-trash-a icon-remove"></span>
              </div>
              <div data-complete="${response.todo.complete}" class="todo">
                ${response.todo.task}
              </div>
            </div>
          `);

          $('#todo_input').val('');

          scroll();
        }
        else {
          alert(response.message);
        }
      });
    }
    else {
      alert('You must insert a task');
    }
  };


  const removeTodo = function(e) {
    // let id = $('.todo-container').attr('id');
    let id = $(this).parent()[0].id;
    // let parent = $(this).parent()[0];
    // let id = parent.id;

        
    console.log('removing ', id);

    $.post("/delete-todo", {
      id: id
    }, function (response) {
      if (response.success) {
        $('#' + response.id).remove();
      }
      else {
        alert(response.message);
      }
    });
  }

  const updateTodo = function (e) {

    let id = $(this).parent()[0].id;
    let complete = $(this).data('complete');

    console.log('complete ', complete);

    if ( complete == 0 ) {
      $.post("/update-todo", {
        id: id
      }, function (response) {
        if (response.success) {
          $('#' + response.id).addClass('checked');
        }
        else {
          alert(response.message);
        }
      });
    }

  }

  $('#btn_create').on('click',createTodo);

  $('#todos_container').on('click', '.remove', removeTodo);

  $('#todos_container').on('click', '.todo', updateTodo);

  $('#todo_input').on('keyup', function (e) {
    if (e.keyCode === 13) {
      createTodo();
    }
  });
});