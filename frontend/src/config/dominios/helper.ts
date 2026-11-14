import {
  DOMINIOS_JSON,
  DOMINIOS_LABELS,
  type DominioKey,
} from "./dominios.const";

export interface DominioOption {
  value: number;
  label: string;
}

const NAO_INFORMADO = "Não informado";

/**
 * Retorna as opções de um domínio para selects.
 *
 * Inclui automaticamente:
 * { value: 0, label: "Não informado" }
 */
export function getDominioOptions(dominio: DominioKey): DominioOption[] {
  const valores = Object.values(DOMINIOS_JSON[dominio]);

  const labels: Record<number, string> = DOMINIOS_LABELS[dominio];

  return [
    {
      value: 0,
      label: NAO_INFORMADO,
    },
    ...valores.map((value) => ({
      value,
      label: labels[value] ?? NAO_INFORMADO,
    })),
  ];
}

/**
 * Retorna o label a partir de um código,
 * pesquisando em todos os domínios.
 */
export function getDominioLabel(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return NAO_INFORMADO;
  }

  const codigo = Number(value);

  if (!Number.isFinite(codigo) || codigo === 0) {
    return NAO_INFORMADO;
  }

  for (const dominio of Object.keys(DOMINIOS_LABELS) as DominioKey[]) {
    const labels: Record<number, string> = DOMINIOS_LABELS[dominio];

    if (Object.prototype.hasOwnProperty.call(labels, codigo)) {
      return labels[codigo];
    }
  }

  return NAO_INFORMADO;
}

/**
 * Retorna o label dentro de um domínio específico.
 */
export function getDominioLabelByKey(
  dominio: DominioKey,
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return NAO_INFORMADO;
  }

  const codigo = Number(value);

  if (!Number.isFinite(codigo) || codigo === 0) {
    return NAO_INFORMADO;
  }

  const labels: Record<number, string> = DOMINIOS_LABELS[dominio];

  return labels[codigo] ?? NAO_INFORMADO;
}

/**
 * Verifica se um código pertence a determinado domínio.
 */
export function isDominioValue(
  dominio: DominioKey,
  value: number | null | undefined,
): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  const valores: readonly number[] = Object.values(DOMINIOS_JSON[dominio]);

  return valores.includes(value);
}
