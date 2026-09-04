describe('MSW padrão', () => {
  it('intercepta a consulta sintética de municípios', async () => {
    const response = await fetch('http://localhost/api/municipios?uf=SP');
    const municipalities = await response.json() as Array<{ codigo: string }>;

    expect(response.status).toBe(200);
    expect(municipalities).toHaveLength(3);
    expect(municipalities.every(({ codigo }) => codigo.startsWith('SYN-'))).toBe(true);
  });
});
