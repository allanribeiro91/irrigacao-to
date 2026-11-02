type CadastroForm = {
  co_cpf: string;
  no_nome: string;
  ds_email: string;
  ds_celular: string;
  ds_senha: string;
  confirmar_senha: string;
};

const initialForm: CadastroForm = {
  co_cpf: "",
  no_nome: "",
  ds_email: "",
  ds_celular: "",
  ds_senha: "",
  confirmar_senha: "",
};

export type { CadastroForm };
export { initialForm };
