import { asyncHandler } from "../middlewares/asyncHandler.js"
import Cart from "../models/cartModel.js"

export const addCartItem = asyncHandler(
    async (req, res) => {

        const userId = req.user._id
        const {productId, variants} = req.body

        console.log("req.body", req.body)

        let cart = await Cart.findOne({user : userId})

        if(!cart){
            cart = await Cart.create({
                user : userId,
                items : [],
            })
        }

        //we will only be upadating one product at a time. But cart may have multiple products
        let cartItem = cart.items.find(item => {
            return item.product.toString() === productId
        })

        if(cartItem){
            //destructure objects withn the arguments itslef
            variants.forEach((variantItem)=>{
                const existingVariant = cartItem.variants.find(v => v.variantId === variantItem.variant)
                if (existingVariant) {
                    // Update quantity and prices
                    existingVariant.quantity = variantItem.qty
                } else {
                    // Add new variant
                    cartItem.variants.push({
                        variantId: variantItem.variant,
                        attributes: variantItem.variantDescription,
                        quantity: variantItem.qty,
                    })
                }
            })
        } else {
            const newCartItem = {
                product: productId,
                variants: variants.map((variantItem) => ({
                    variantId: variantItem.variant,
                    attributes: variantItem.variantDescription,
                    quantity: variantItem.qty,
                })),
            }
            cart.items.push(newCartItem)
        }

        await cart.save()

        res.status(200).json({
            success: true,
            message : "Product added to cart successfully",
            cart
        })
    }
)

export const getCartItems = asyncHandler(
    async (req, res) => {
    }
)