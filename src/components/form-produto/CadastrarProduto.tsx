import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { Produto } from '../../dtos/Produto';
import { alertService } from '../../services/AlertService';
import CurrencyInput from 'react-currency-input';
import './CadastrarProduto.css'
import { ProdutoService } from '../../services/ProdutoService';

export function CadastrarProduto() {
	const [showMessage, setShowMessage] = useState(false);
	const [formData, setFormData] = useState<Produto>(new Produto());
	const { control, formState: { errors }, handleSubmit, reset, watch } = useForm({ defaultValues: formData });
	const [validacoes, setValidacoes] = useState({ embalagem: false, multiplo: false });


	const produtoService = new ProdutoService();

	const camposValidacoes = ['embalagem', 'multiplo'];

	useEffect(() => {
		watch((value, { name }) => {
			validarCampos(name);
		});
	}, []);

	function onSubmit(data: any) {
		camposValidacoes.forEach(campo => validarCampos(campo));
		if (Object.keys(validacoes).some(item => validacoes[item] === true)) {
			return;
		}
		setFormData(data);
		setShowMessage(true);
		salvarProduto(data);
	}

	function salvarProduto(produto) {
		produto.preco = parseFloat(produto.preco.replaceAll('.', '').replaceAll(',', '.'));
		produtoService.save(produto)
			.then(() => {
				alertService.success('Produto cadastrado com sucesso.');
				setTimeout(() => {
					window.history.back();
				}, 1500);
			})
			.catch(() => {
				alertService.error('Erro ao cadastrar produto, consulte o administrador.');
			});
	}

	function validarCampos(campo) {
		if (camposValidacoes.includes(campo)) {
			const campoValidarhasValor = campo === 'multiplo' ? 'embalagem' : 'multiplo';
			if (!control._formValues['multiplo'] && !control._formValues['embalagem']) {
				camposValidacoes.forEach(c => {
					validacoes[c] = false;
				})
			} else {
				validacoes[campoValidarhasValor] = !control._formValues[campoValidarhasValor] ? true : false;
				validacoes[campo] = control._formValues[campo] ? false : true;
			}

			setValidacoes(validacoes);
		}
	}

	function getFormErrorMessage(name: string) {
		return errors[name] && <small className='p-error'>{errors[name].message}</small>
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Container>
				<Row><h1>Cadastrar Produto</h1></Row>
				<Row>
					<Col md={6} sm>
						<div className='field'>
							<label htmlFor='name'>Nome*</label>
							<span className='p-float-label' >
								<Controller name='nome' control={control} rules={{ required: 'Nome obrigatório.' }} render={({ field, fieldState }) => (
									<InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
								)} />
							</span>
							{getFormErrorMessage('nome')}
						</div>
					</Col>
					<Col md={3} sm>
						<div className='field'>
							<label htmlFor='preco'>Preço*</label>
							<Controller name='preco' control={control} rules={{ required: 'Preço obrigatório.' }} render={({ field, fieldState }) => (
								<CurrencyInput id={field.name} {...field} decimalSeparator="," thousandSeparator="." maskOptions={undefined} className={`campo-preco ${classNames({ 'p-invalid': fieldState.invalid })}`} />
							)} />
						</div>
					</Col>
					<Col md={3} sm>
						<div className='field'>
							<label htmlFor='codigo'>Código*</label>
							<span className='p-float-label' >
								<Controller name='codigo' control={control} rules={{ required: 'Código obrigatório.' }} render={({ field, fieldState }) => (
									<InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
								)} />
							</span>
							{getFormErrorMessage('codigo')}
						</div>
					</Col>
					<Col md={3} sm>
						<div className='field'>
							<label htmlFor='embalagem'>Embalagem{validacoes.embalagem && '*'}</label>
							<span className='p-float-label' >
								<Controller name='embalagem' control={control} render={({ field, fieldState }) => (
									<InputText id={field.name} {...field} className={classNames({ 'p-invalid': validacoes[field.name] })} />
								)} />
							</span>
							{validacoes.embalagem && <small className='p-error'>Embalagem obrigatória</small>}
						</div>
					</Col>
					<Col md={3} sm>
						<div className='field'>
							<label htmlFor='multiplo'>Múltiplo{validacoes.multiplo && '*'}</label>
							<span className='p-float-label' >
								<Controller name='multiplo' control={control} render={({ field, fieldState }) => (
									<InputText id={field.name} {...field} type='number' min={0} className={classNames({ 'p-invalid': validacoes[field.name] })} />
								)} />
							</span>
							{validacoes.multiplo && <small className='p-error'>Múltiplo obrigatório</small>}
						</div>
					</Col>
					<Col md={3} sm>
						<div className='field'>
							<label htmlFor='ipi'>IPI</label>
							<span className='p-float-label' >
								<Controller name='ipi' control={control} render={({ field, fieldState }) => (
									<InputText id={field.name} {...field} type='number' min={0} className={classNames({ 'p-invalid': fieldState.invalid })} />
								)} />
							</span>
							{getFormErrorMessage('ipi')}
						</div>
					</Col>
				</Row>
				<Row>
					<Col style={{ textAlign: 'end' }}>
						<div className="field">
							<Button label='Cancelar' className='p-button-warning mr-2' type='button' onClick={() => window.history.back()} />
							<Button style={{ marginLeft: '20px' }} label='Cadastrar' className='p-button-success mr-2' type='submit' />
						</div>
					</Col>
				</Row>
			</Container>
		</form >
	)
}
