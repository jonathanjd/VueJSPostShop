let PRICE = 9.99;

new Vue({

    el: '#app',

    data: {

        total: 0,
        items: [
        ],

        cart: [],

        newSearch: 'anime',

        lastSearch: '',

        loading: false,

        price: PRICE
    },

    methods: {

        onSubmit(){

            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then( response => {
                    this.lastSearch = this.newSearch;
                    this.items = response.data;
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

    },

});