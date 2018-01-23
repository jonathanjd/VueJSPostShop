const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({

    el: '#app',

    data: {

        total: 0,
        items: [
        ],

        cart: [],

        result: [],

        newSearch: 'anime',

        lastSearch: '',

        loading: false,

        price: PRICE
    },

    computed: {

        noMoreItems(){
            return this.items.length === this.result.length && this.result.length > 0;
        }

    },

    methods: {

        appendItems(){
            
            if (this.items.length < this.result.length) {
                let append = this.result.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }

        },

        onSubmit(){

            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then( response => {
                    this.lastSearch = this.newSearch;
                    this.result = response.data;
                    this.appendItems();
                    this.loading = false;
                });

        },

        addItem(index){
            this.total += PRICE;
            
            let item = this.items[index];

            let found = false;

            for (let i = 0; i < this.cart.length; i++) {
                
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty ++;
                    break;
                }

            }

            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },

        inc(item){
            item.qty ++;
            this.total += PRICE;
        },

        dec(item){
            item.qty --;
            this.total -= PRICE;

            if (item.qty <= 0) {
                for (let i = 0; i < this.cart.length; i++) {
                   if (this.cart[i].id === item.id) {
                       this.cart.splice(i, 1);
                       break;
                   }
                }
            }
        },

    },

    filters: {

        currency(price){
            return '$'.concat(price.toFixed(2));
        },

    },

    mounted(){

        this.onSubmit();
        let vueInstance = this;
        let elem = document.getElementById('product-list-bottom');
        let watcher = scrollMonitor.create(elem);
        watcher.enterViewport( function(){
            vueInstance.appendItems();
        });

    },


});
