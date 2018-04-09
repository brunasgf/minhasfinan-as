const app = angular.module("minhasFinancas")

app.service("Notify", ['ngDialog', function (ngDialog) {
        this.openModal = function (title, message){
            return ngDialog.open({
                template: `
                    <h4 class="sub-title">${title}</h4>
                    <div>
                        <p>
                            ${message}
                        </p>
                    </div>
                `,
                plain: true,
                className: 'ngdialog-theme-default',
                width: '80%',
            });
        }

        this.openModalTemplate = function (html, scope){
            return ngDialog.open({ 
                template: html,
                plain: true,
                className: 'ngdialog-theme-default', 
                scope: scope ,
                width: '55%',
            });
        }
    }
])