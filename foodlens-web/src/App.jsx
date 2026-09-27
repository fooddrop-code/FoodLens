import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [servingSize, setServingSize] = useState('')
  const [servingUnit, setServingUnit] = useState('g')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [sugar, setSugar] = useState('')
  const [fat, setFat] = useState('')
  const [sodium, setSodium] = useState('')
  const [products, setProducts] = useState(() => {
  const savedProducts = localStorage.getItem('foodlens-products')

    return savedProducts ? JSON.parse(savedProducts) : []
  })
  const [errorMessage, setErrorMessage] = useState('')
    const [unitFilter, setUnitFilter] = useState('all')
      const [sortOption, setSortOption] = useState('default')
        const [editingProduct, setEditingProduct] = useState(null)
          const [chartMetric, setChartMetric] = useState('protein')
  const displayedProducts = products.filter(
    (product) =>
      unitFilter === 'all' || product.servingUnit === unitFilter
  )

   const sortedProducts = [...displayedProducts].sort(
    (firstProduct, secondProduct) => {
      if (unitFilter === 'all' || sortOption === 'default') {
        return 0
      }

      const firstValue =
        Number(firstProduct[sortOption]) /
        Number(firstProduct.servingSize)

      const secondValue =
        Number(secondProduct[sortOption]) /
        Number(secondProduct.servingSize)

      if (sortOption === 'calories') {
        return firstValue - secondValue
      }

      return secondValue - firstValue
    }
  )

  const chartMetricInfo = {
    calories: { label: '열량', unit: 'kcal' },
    fat: { label: '지방', unit: 'g' },
    sugar: { label: '당류', unit: 'g' },
    sodium: { label: '나트륨', unit: 'mg' },
    protein: { label: '단백질', unit: 'g' },
  }

  const selectedChartMetric = chartMetricInfo[chartMetric]

  const chartProducts = sortedProducts.map((product) => ({
    name: product.name,
    value:
      (Number(product[chartMetric]) / Number(product.servingSize)) * 100,
  }))

  const highestChartValue = Math.max(
    ...chartProducts.map((product) => product.value),
    1
  )
    const gramProductCount = products.filter(
    (product) => product.servingUnit === 'g'
  ).length

  const milliliterProductCount = products.filter(
    (product) => product.servingUnit === 'mL'
  ).length
   useEffect(() => {
      localStorage.setItem('foodlens-products', JSON.stringify(products))
  }, [products])

  function addProduct() {
    const numericServingSize = Number(servingSize)

    if (!productName.trim()) {
      setErrorMessage('제품명을 입력하세요.')
      return
    }

    if (!numericServingSize || numericServingSize <= 0) {
      setErrorMessage('0보다 큰 표시 기준량을 입력하세요.')
      return
    }

    if (
      calories === '' ||
      fat === '' ||
      sugar === '' ||
      sodium === '' ||
      protein === ''
    ) {
      setErrorMessage('열량, 지방, 당류, 나트륨, 단백질 값을 모두 입력하세요.')
      return
    }

    const newProduct = {
      name: productName,
      servingSize,
      servingUnit,
      calories,
      fat,
      sugar,
      sodium,
      protein,
    }

        if (editingProduct) {
      setProducts(
        products.map((product) =>
          product === editingProduct ? newProduct : product
        )
      )
    } else {
      setProducts([...products, newProduct])
    }

    setEditingProduct(null)
    setProductName('')
    setServingSize('')
    setServingUnit('g')
    setCalories('')
    setFat('')
    setSugar('')
    setSodium('')
    setProtein('')
    setErrorMessage('')
  }

    function removeProduct(productToRemove) {
    setProducts(
      products.filter((product) => product !== productToRemove)
    )
  }
   function startEditing(productToEdit) {
    setProductName(productToEdit.name)
    setServingSize(productToEdit.servingSize)
    setServingUnit(productToEdit.servingUnit)
    setCalories(productToEdit.calories)
    setFat(productToEdit.fat)
    setSugar(productToEdit.sugar)
    setSodium(productToEdit.sodium)
    setProtein(productToEdit.protein)
    setEditingProduct(productToEdit)
    setErrorMessage('')
  }

  function cancelEditing() {
    setProductName('')
    setServingSize('')
    setServingUnit('g')
    setCalories('')
    setFat('')
    setSugar('')
    setSodium('')
    setProtein('')
    setEditingProduct(null)
    setErrorMessage('')
  }
    function exportProductsToCsv() {
    const headers = [
      '제품명',
      '표시 기준량',
      '기준 단위',
      '열량 (kcal)',
      '지방 (g)',
      '당류 (g)',
      '나트륨 (mg)',
      '단백질 (g)',
    ]

    const rows = products.map((product) => [
      product.name,
      product.servingSize,
      product.servingUnit,
      product.calories,
      product.fat,
      product.sugar,
      product.sodium,
      product.protein,
    ])

    const csvText = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n')

    const file = new Blob([`\uFEFF${csvText}`], {
      type: 'text/csv;charset=utf-8;',
    })

    const fileUrl = URL.createObjectURL(file)
    const downloadLink = document.createElement('a')

    downloadLink.href = fileUrl
    downloadLink.download = 'foodlens-products.csv'
    downloadLink.click()

    URL.revokeObjectURL(fileUrl)
  }

  function calculatePer100(value, currentServingSize) {
    const numericValue = Number(value)
    const numericServingSize = Number(currentServingSize)

    if (!numericServingSize) {
      return '–'
    }

    return ((numericValue / numericServingSize) * 100).toFixed(1)
  }

  return (
    <main>
      <h1>FoodLens</h1>
      <p>식품 제품 비교를 위한 R&D 분석 도구</p>
                  <section className="summary-section">
        <article className="summary-card summary-card-primary">
          <p className="summary-label">등록 제품</p>
          <strong className="summary-number">{products.length}</strong>
          <span className="summary-unit">개</span>
        </article>

        <article className="summary-card">
          <p className="summary-label">g 기준 제품</p>
          <strong className="summary-number">{gramProductCount}</strong>
          <span className="summary-unit">개</span>
        </article>

        <article className="summary-card">
          <p className="summary-label">mL 기준 제품</p>
          <strong className="summary-number">{milliliterProductCount}</strong>
          <span className="summary-unit">개</span>
        </article>
      </section>

      <section>
        <h2>제품 추가</h2>

        <label htmlFor="product-name">제품명</label>
        <input
          id="product-name"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="예: 단백질 음료"
        />

        <label htmlFor="serving-size">표시 기준량</label>
        <input
          id="serving-size"
          type="number"
          value={servingSize}
          onChange={(event) => setServingSize(event.target.value)}
          placeholder="예: 250"
        />

        <label htmlFor="serving-unit">기준량 단위</label>
        <select
          id="serving-unit"
          value={servingUnit}
          onChange={(event) => setServingUnit(event.target.value)}
        >
          <option value="g">g</option>
          <option value="mL">mL</option>
        </select>

        <label htmlFor="calories">열량 (kcal)</label>
        <input
          id="calories"
          type="number"
          value={calories}
          onChange={(event) => setCalories(event.target.value)}
          placeholder="예: 150"
        />

        <label htmlFor="fat">지방 (g)</label>
        <input
          id="fat"
          type="number"
          min="0"
          value={fat}
          onChange={(event) => setFat(event.target.value)}
          placeholder="예: 3"
        />

        <label htmlFor="sugar">당류 (g)</label>
        <input
          id="sugar"
          type="number"
          min="0"
          value={sugar}
          onChange={(event) => setSugar(event.target.value)}
          placeholder="예: 5"
        />

        <label htmlFor="sodium">나트륨 (mg)</label>
        <input
          id="sodium"
          type="number"
          min="0"
          value={sodium}
          onChange={(event) => setSodium(event.target.value)}
          placeholder="예: 300"
        />

        <label htmlFor="protein">단백질 (g)</label>
        <input
          id="protein"
          type="number"
          value={protein}
          onChange={(event) => setProtein(event.target.value)}
          placeholder="예: 20"
        />

        <button type="button" onClick={addProduct}>
          {editingProduct ? '제품 수정 완료' : '제품 목록에 추가'}
        </button>
                {editingProduct && (
          <button
            type="button"
            className="cancel-edit-button"
            onClick={cancelEditing}
          >
            수정 취소
          </button>
        )}

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}
      </section>

      <section>
        <h2>100단위 기준 비교</h2>
        <p>g 기준 제품과 mL 기준 제품은 직접 비교하지 마세요.</p>
               <div className="filter-bar">
          <label htmlFor="unit-filter">비교 기준</label>
          <select
            id="unit-filter"
            value={unitFilter}
            onChange={(event) => setUnitFilter(event.target.value)}
          >
            <option value="all">전체 보기</option>
            <option value="g">g 기준 제품만</option>
            <option value="mL">mL 기준 제품만</option>
          </select>

          <label htmlFor="sort-option">정렬</label>
          <select
            id="sort-option"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            disabled={unitFilter === 'all'}
          >
            <option value="default">등록 순서</option>
            <option value="protein">단백질 높은 순</option>
            <option value="calories">열량 낮은 순</option>
            <option value="sugar">당류 높은 순</option>
            <option value="sodium">나트륨 높은 순</option>
          </select>
        </div>
                <div className="comparison-actions">
          <button
            type="button"
            className="export-button"
            onClick={exportProductsToCsv}
            disabled={products.length === 0}
          >
            CSV로 내보내기
          </button>
        </div>
        {products.length === 0 ? (
          <p>아직 추가한 제품이 없습니다.</p>
        ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>제품명</th>
                <th>표시 기준량</th>
                <th>100단위당 열량</th>
                <th>100단위당 지방</th>
                <th>100단위당 당류</th>
                <th>100단위당 나트륨</th>
                <th>100단위당 단백질</th>
                <th>관리</th>
              </tr>
            </thead>

       <tbody>
  {sortedProducts.map((product) => (
    <tr key={`${product.name}-${product.servingSize}-${product.servingUnit}`}>
      <td>{product.name}</td>

      <td>
        {product.servingSize} {product.servingUnit}
      </td>

      <td>
        {calculatePer100(
          product.calories,
          product.servingSize
        )}{' '}
        kcal / 100{product.servingUnit}
      </td>

      <td>
        {calculatePer100(
          product.fat,
          product.servingSize
        )}{' '}
        g / 100{product.servingUnit}
      </td>

      <td>
        {calculatePer100(
          product.sugar,
          product.servingSize
        )}{' '}
        g / 100{product.servingUnit}
      </td>

      <td>
        {calculatePer100(
          product.sodium,
          product.servingSize
        )}{' '}
        mg / 100{product.servingUnit}
      </td>

      <td>
        {calculatePer100(
          product.protein,
          product.servingSize
        )}{' '}
        g / 100{product.servingUnit}
      </td>

      <td className="table-actions">
  <button
    type="button"
    className="edit-button"
    onClick={() => startEditing(product)}
  >
    수정
  </button>

  <button
    type="button"
    onClick={() => removeProduct(product)}
  >
    삭제
  </button>
</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
        )}
                        {unitFilter === 'all' ? (
          <p className="chart-guide">
            영양성분 그래프를 보려면 g 또는 mL 기준 제품을 선택하세요.
          </p>
        ) : (
          <div className="chart-panel">
            <div className="chart-heading">
              <div>
                <h3>
                  100단위당 {selectedChartMetric.label} 비교
                </h3>
                <span>{unitFilter} 기준</span>
              </div>

              <select
                value={chartMetric}
                onChange={(event) => setChartMetric(event.target.value)}
                aria-label="그래프 영양성분 선택"
              >
                <option value="protein">단백질</option>
                <option value="calories">열량</option>
                <option value="fat">지방</option>
                <option value="sugar">당류</option>
                <option value="sodium">나트륨</option>
              </select>
            </div>

            {chartProducts.map((product) => (
              <div className="chart-row" key={product.name}>
                <div className="chart-product-info">
                  <span>{product.name}</span>
                  <strong>
                    {product.value.toFixed(1)} {selectedChartMetric.unit}
                  </strong>
                </div>

                <div className="chart-track">
                  <div
                    className="chart-fill"
                    style={{
                      width: `${
                        (product.value / highestChartValue) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App