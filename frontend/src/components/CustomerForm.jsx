import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { updateCustomerFormObject } from '../actions'
import { updateCustomerFormUsage } from '../actions'
import { addCustomer, selectCustomer } from '../actions'
import RestAPI from '../rest';
import { deleteCustomer } from '../actions'
let restapi = null;

const CustomerForm = ({ customer, usage, handleChange, handleCustomerEditClick, 
                    handleEditCancelClick, handleCustomerSaveClick, 
                    handleCustomerDeleteClick }) => (
    <div id='customer-form' className='card bg-light' hidden={ usage === 'none'}>
        <div>
            <div className='card-header bg-secondary text-white'>
            <h4>Add or Edit a User</h4>
            </div>
            <form >
                <table className='table'><tbody>
                    <tr>
                        <td>Email:</td>
                        <td><input type={'text'} className='rounded' name={'name'} onChange={handleChange} 
                             placeholder={'Enter an Email'}
                             value={customer.name} disabled={usage==='none'||usage==='view'} /></td>
                    </tr>
                    <tr>
                        <td>Name:</td>
                        <td><input type={'text'} className='rounded' name={'email'} onChange={handleChange} 
                             placeholder={'Enter a Name'}
                             value={customer.email} disabled={usage==='none'||usage==='view'} /></td>
                    </tr>
                    {/* <tr>
                        <td>Password:</td>
                        <td><input type={'text'} name={'password'} onChange={handleChange} 
                             placeholder={'Enter a Password'}
                             value={customer.password} disabled={usage==='none'||usage==='view'} /></td>
                    </tr>                      */}
                </tbody></table>
                <input style={{width:'fit-content'}} className='btn btn-danger' type={'button'} value="Delete" 
                    onClick={ (e)=>handleCustomerDeleteClick(e, customer) } 
                    hidden={usage ==='none' || usage === 'view' || usage === 'add' } />
                <input style={{width:'fit-content'}} className='btn btn-success' type={'button'} value="Save" onClick={ (e)=>handleCustomerSaveClick(e, customer, usage) } hidden={ usage === 'none' || usage === 'view'} />
                <input style={{width:'fit-content'}} className='btn btn-outline-secondary' type={'button'} value="Cancel" onClick={ (e)=>handleEditCancelClick(e, customer, usage) } hidden={ usage === 'none' || usage === 'view'} />
                <input style={{width:'fit-content'}} className='btn btn-outline-secondary' type={'button'} value="Edit" onClick={ (e)=>handleCustomerEditClick(e, customer) } hidden={ usage === 'none' || usage === 'edit' || usage === 'add'} />
            </form>
        </div>  
    </div>
)

CustomerForm.propTypes = {
  customer:  PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
}

const mapStateToProps = (state) => {
  restapi = new RestAPI(state.login.token);
  return {
    customer: state.formState.customer,
    usage: state.formState.usage,
    appState: state.appState
  }
}

const mapDispatchToProps = (dispatch) => {
  return { 
    handleChange: (e) => {
        const field_name = e.currentTarget.name;
        const field_value = e.currentTarget.value;
        dispatch( updateCustomerFormObject( field_name, field_value ));
    },
    handleCustomerEditClick: (event, customer, usage) => {
        console.log("in CustomerForm.handleCustomerEditClick");
        dispatch( updateCustomerFormUsage('edit', customer) );        
    },
    handleEditCancelClick: (event, customer, usage) => {
        console.log("in CustomerForm.handleEditCancelClick");
        if(usage === 'add'){
          dispatch( updateCustomerFormUsage('none') );
        }else if(usage === 'edit'){
          dispatch(updateCustomerFormUsage('none'));
        }     
    },
    handleCustomerSaveClick: (event, customer, usage) => {
        console.log("in CustomerForm.handleCustomerSaveClick");
        dispatch(addCustomer(customer));
        if(usage === 'add'){
            dispatch(selectCustomer(customer));
        }
        dispatch(updateCustomerFormUsage('none'));
        restapi.putCustomer(dispatch, customer);
    },
    handleCustomerDeleteClick: (event, customer) => {
        console.log("in CustomerForm.handleCustomerDeleteClick");
        console.log("customer: " + JSON.stringify(customer));
        dispatch(deleteCustomer(customer));
        dispatch(updateCustomerFormUsage('none')); 
        restapi.deleteCustomer(dispatch, customer);       
    }             
  }
}

const VisibleCustomerForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerForm)

export default VisibleCustomerForm