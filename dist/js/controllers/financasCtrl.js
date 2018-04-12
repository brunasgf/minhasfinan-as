const app = angular.module("minhasFinancas")
let echarts = require('echarts')

app.controller("FinancasCtrl", ['$scope', 'Notify', 'toastr',
    ($scope, Notify, toastr)=>{
        $scope.idFinance = 1

        $scope.created = {
            name: null,
            value: null,
            category: null
        }

        $scope.hasAnalise = false

        $scope.financeData = {
            list: [],
            graphData: [
                {value:0, name:'Gastos'},
                {value:0, name:'Receitas'},
                {value:0, name:'Investimentos'}
            ]
        }

        let optionsPieGraph = {
            title : {
                text: 'Finanças por categoria',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : R${c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['Gastos','Receitas','Investimentos']
            },
            calculable : true,
            series : [
                {
                    name: "Finanças",
                    type:'pie',
                    radius : '50%',
                    center : ['50%', '50%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true,
                                position: 'center',
                                textStyle : {
                                    fontSize : '10',
                                    fontWeight : 'bold'
                                }
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[]
                }
            ]
        }

        const financasPercent = {
            total: 0,
            gastos: 0,
            investimentos: 0,
            receitas: 0 
        }

        const getData = () =>{
            $scope.categList = {
                gastos: [
                    {nome:"alimentação", tipo:"básica"},
                    {nome:"automóvel", tipo:"estilo de vida"},
                    {nome:"beleza", tipo:"estilo de vida"},
                    {nome:"bem estar", tipo:"estilo de vida"},
                    {nome:"educação", tipo:"básica"},
                    {nome:"empregados", tipo:"estilo de vida"},
                    {nome:"familiares", tipo:"básica"},
                    {nome:"impostos e tarifas", tipo:"básica"},
                    {nome:"lazer", tipo:"estilo de vida"},
                    {nome:"moradia", tipo:"básica"},
                    {nome:"outras", tipo:"estilo de vida"},
                    {nome:"pessoais", tipo:"estilo de vida"},
                    {nome:"previdência", tipo:"básica"},
                    {nome:"saúde", tipo:"básica"},
                    {nome:"seguro", tipo:"básica"},
                    {nome:"telefonia/tv/internet", tipo:"estilo de vida"},
                    {nome:"transporte", tipo:"básica"},
                    {nome:"vestuário", tipo:"estilo de vida"}
                ],
                receitas: [
                    {nome:"aluguel", tipo:"dinheiro do mês"},
                    {nome:"lucros", tipo:"dinheiro do mês"},
                    {nome:"pró-labore", tipo:"dinheiro do mês"},
                    {nome:"rendimentos", tipo:"dinheiro do mês"},
                    {nome:"salário", tipo:"dinheiro do mês"}
                ],
                investimentos:[
                    {nome:"investimento/consórcio", tipo:"despesa investimento"},
                    {nome:"investimento/poupança", tipo:"despesa investimento"},
                    {nome:"quitação de dívidas", tipo:"despesa investimento"}
                ]
            }
        }

        const openModalCreate = (typeAdd) =>{
            $scope.typeAdd = typeAdd
            const template = `
            <div class="row" ng-controller="FinancasCtrl" ng-init="getData()">
                <div class="col-12">
                    <h1 class="main-title">Adicionando {{typeAdd}}</h1>
                </div>

                <div class="col-6">
                    <label>Nome</label>
                    <input type="text" placeholder="digite o nome" class="form-control" ng-model="created.name">
                </div>

                <div class="col-6">
                    <label>Valor</label>
                    <input ui-number-mask="2" type="text" placeholder="digite o valor" class="form-control" ng-model="created.value">
                </div>

                <div class="col-12 form-group">
                    <label>Categoria</label>
                    <select class="form-control" ng-model="created.category" ng-options="cat.nome for cat in categList[typeAdd]"></select>
                </div>

                <div class="col-12 text-right">
                    <button class="btn btn-danger" ng-click="closeThisDialog(null)">
                        Cancelar
                    </button>
                    <button class="btn btn-success" ng-click="validateFields(created)">
                        Adicionar
                    </button>
                </div>
            </div>
            ` 
            const x = $scope
            return Notify.openModalTemplate(template, x)
            .closePromise.then((res)=>{
                if(res && res.value && res.value.added){
                    res.value.id = $scope.idFinance
                    $scope.idFinance++
                    switch(res.value.tipo){
                        case "gastos":

                        $scope.financeData.graphData[0].value += res.value.value
                        break

                        case "receitas":
                        $scope.financeData.graphData[1].value += res.value.value
                        break

                        case "investimentos":
                        $scope.financeData.graphData[2].value += res.value.value
                        break
                    }

                    $scope.financeData.list.push(res.value)
                    toastr.success(`Finança adicionada com sucesso!`, 'Adicionado com sucesso')
                }
                generateGraph()
            })
        }

        const validateFields = (finance) => {
            if (!finance.name){
                toastr.error(`Por Favor, digite o campo nome`, 'Problema nos campos')
            } else if (!finance.value){
                toastr.error(`Por Favor, digite o campo valor`, 'Problema nos campos')
            } else if (!finance.category){
                toastr.error(`Por Favor, selecione uma categoria`, 'Problema nos campos')
            } else {
                finance.added = true
                finance.tipo = $scope.typeAdd
                $scope.closeThisDialog(finance)
            }
        }

        const removeFromListFinaces = (finance) => {
            const indexFoundedFinance = $scope.financeData.list.indexOf(finance)
            switch($scope.financeData.list[indexFoundedFinance].tipo){
                case "gastos":
                $scope.financeData.graphData[0].value -= $scope.financeData.list[indexFoundedFinance].value
                break

                case "receitas":
                $scope.financeData.graphData[1].value -= $scope.financeData.list[indexFoundedFinance].value
                break

                case "investimentos":
                $scope.financeData.graphData[2].value -= $scope.financeData.list[indexFoundedFinance].value
                break
            }
            $scope.financeData.list.splice(indexFoundedFinance,1)
            generateGraph()
            toastr.success(`Finança deletada com sucesso!`, 'Deletado com sucesso')
        }

        const generateGraph = () => {
            const pieChart = echarts.init(document.getElementById('categoryGraph'))
            optionsPieGraph.series[0].data = $scope.financeData.graphData   
            pieChart.setOption(optionsPieGraph)
        }

        const openModalAbout = () => {
            const template = `
            <div class="row" ng-controller="FinancasCtrl" ng-init="getData()">
                <div class="col-12">
                    <h1 class="main-title">Sobre Nós</h1>
                </div>

                <div class="col-12">
                    <p>Este aplicativo utiliza a regra 50-15-35. Ela funciona da seguinte maneira:</p> 
                    <br>
                    <p>50% para gastos <b>essenciais</b>:</p>
                    <p>Os gastos essenciais englobam todos as despesas necessárias para você se manter no dia-a-dia: 
                    moradia, educação, saúde, transporte e alimentação são exemplos. Logo, entram nessa categoria 
                    gastos como: aluguel, conta de luz, gás, telefone, escola, passagem de ônibus, gasolina, aula 
                    de inglês, convênio médico, remédios, terapia, feira e supermercado.</p>
                    <br>
                    <p>15% para prioridades <b>financeiras</b>:</p>
                    <p>Há duas possibilidades para suas prioridades financeiras, dependendo de como está sua situação financeira:</p>
                    <br>
                    <p>1. Se você <b>está endividado</b>: sua prioridade financeira será quitar suas dívidas. Vale lembrar 
                    que dependendo da gravidade da sua situação financeira, talvez seja necessário comprometer mais 
                    do que 15% da renda para resolvê-la. Nesse caso, você terá que compensar cortando gastos nos dois 
                    demais grupos: estilo de vida (falaremos dele em seguida) e gastos essenciais (apesar de haver menor 
                    margem de corte, sempre é possível economizar na conta de celular e supermercado). Considere pegar 
                    um empréstimo em uma instituição que cobre juros baixos, caso esteja enrolado em créditos caros como 
                    o cheque especial.</p>
                    <br>
                    <p>2. Se você <b>não está endividado</b>: sua prioridade financeira será poupar parte da sua renda para conquistar 
                    seus objetivos de médio e longo prazo. Guardando 15% da renda por mês, seu primeiro objetivo 
                    financeiro deve ser construir uma reserva de emergência de três a seis salários, para que você 
                    se proteja dos momentos de incerteza da vida e não tenha que recorrer ao cheque especial cada vez que se 
                    deparar com um gasto inesperado.</p>
                    <br>
                    <p>35% para manter seu <b>estilo de vida</b>:</p>
                    <p>Com os gastos essenciais em ordem e as prioridades financeiras garantidas, você está livre para usar o 
                    dinheiro com o que te dá prazer. As despesas relacionadas a seu estilo de vida são todas aquelas que 
                    não são essenciais (ou seja, podem ser cortadas em um momento de aperto), mas são importantes para que 
                    você se divirta e aproveite a vida: bares e restaurantes, balada, academia, salão de beleza, viagens, tv a cabo, 
                    assinatura de revistas e compras no shopping são exemplos.</p>
                    <br>
                    <p>O <b>grande segredo</b> é entender que as despesas relacionadas ao estilo de vida devem vir depois de você já ter 
                    cuidado dos seus gastos essenciais e das suas prioridades financeiras. Nessa situação, você está <b>livre para 
                    gastar</b> sem culpa nenhuma.</p>
                    <br><br>
                    <p>Então vamos logo cadastrar as suas finanças para <b>melhorar sua gestão de gastos??? :)</b></p>
                    <br><br>
                </div>
            </div>
            `

            return Notify.openModalTemplate(template)
            .closePromise.then((res)=>{
                generateGraph()
            })
        }

        const makeAnalisis = () => {
            let totalRenda = 0
            let totalBasico = 0
            let totalEstiloDeVida = 0
            let totalInvestimentos = 0
            $scope.gastoAnormalList = []
            for(var i = 0; i < $scope.financeData.list.length; i++){
                if($scope.financeData.list[i].category.tipo === 'básica'){
                    totalBasico += $scope.financeData.list[i].value
                }

                if($scope.financeData.list[i].category.tipo === 'dinheiro do mês'){
                    totalRenda += $scope.financeData.list[i].value
                }

                if($scope.financeData.list[i].category.tipo === 'estilo de vida'){
                    totalEstiloDeVida += $scope.financeData.list[i].value
                }

                if($scope.financeData.list[i].category.tipo === 'despesa investimento'){
                    totalInvestimentos += $scope.financeData.list[i].value
                }
            }



            if((totalBasico / totalRenda) > 0.5){
                $scope.gastoAnormalList.push("Gastos Basicos")
            }

            if((totalEstiloDeVida / totalRenda) > 0.35){
                $scope.gastoAnormalList.push("Estilo de Vida")
            }

            if((totalInvestimentos / totalRenda) > 0.15){
                $scope.gastoAnormalList.push("Investimentos")
            }

            $scope.hasAnalise = true
        }

        const openModalConfirm = (finance) => {
            return Notify.openConfirm()
            .then((res)=>{
                removeFromListFinaces(finance)
            })
            .catch((err)=>{
                toastr.info(`Sua finança esta sã e salva`, 'Não se preocupe :)')
            })
        } 

        generateGraph()

        $scope.getData = getData
        $scope.openModalCreate = openModalCreate
        $scope.openModalAbout = openModalAbout
        $scope.makeAnalisis = makeAnalisis
        $scope.validateFields = validateFields
        $scope.openModalConfirm = openModalConfirm
    }   
])