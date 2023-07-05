const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  storeInfo: state => state.user.storeInfo,
  orderList: state => state.order.orderList,
  total: state => state.order.total,
  order: state => state.order.order,
  backStockList: state => state.order.backStockList,
  backStock: state => state.order.backStock,
  productMessage: state => state.product.productMessage,
  category_id: state => state.product.category_id,
  spuTitle: state => state.product.spuTitle,
  token: state => state.user.token
}
export default getters
