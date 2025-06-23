'use client';

import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import CreateCategoryDialog from '../_components/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog';
import { Separator } from '@/components/ui/separator';

function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="border-b bg-muted/10">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-8">
          <div>
            <h1 className="text-3xl font-bold">Manage</h1>
            <p className="text-muted-foreground">Manage your account settings and categories</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 px-4 py-7 md:px-15">
        <Card className="px-6 sm:px-10 bg-muted/30">
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency for transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </div>
  );
}

export default Page;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === 'expense' ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === 'income' ? 'Income' : 'Expenses'} categories
                <div className="text-sm text-muted-foreground">Sorted by name</div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm cursor-pointer hover:cursor-pointer">
                  <PlusSquare className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable ? (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{' '}
              <span className={cn('m-1', type === 'income' ? 'text-emerald-500' : 'text-red-500')}>
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">Create one to get started</p>
          </div>
        ) : (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex flex-col justify-between rounded-md border border-muted-foreground/20 transition-shadow duration-200">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span className="font-medium">{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full items-center gap-2 rounded-t-none text-muted-foreground hover:bg-transparent hover:text-red-500 border-t border-muted-foreground/20 hover:border-red-300/30 transition-colors duration-200"
            variant={'ghost'}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
}
